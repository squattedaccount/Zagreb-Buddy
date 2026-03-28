# Backend implementation

## 4.1 FastAPI server (`agent/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from zagreb_agent import ZagrebAgent
import uuid

app = FastAPI(title="Zagreb Buddy Agent")

# CORS — only needed if calling directly from browser
# With Next.js proxy, this is just a safety net
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://zagrebbuddy.vercel.app",
        "http://localhost:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = ZagrebAgent()


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    user_context: dict | None = None  # optional: {lat, lng, language}


class PlaceResponse(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    one_liner: str
    why_recommended: str
    practical_tip: str
    visit_duration_min: int
    category: str


class ItineraryResponse(BaseModel):
    places: list[PlaceResponse]
    total_duration_min: int
    total_walking_min: int
    weather_note: str | None = None


class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    itinerary: ItineraryResponse | None = None
    follow_ups: list[str] = []
    active_skills: list[str] = []
    needs_more_info: bool = False


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    conversation_id = req.conversation_id or str(uuid.uuid4())

    result = await agent.chat(
        message=req.message,
        session_id=conversation_id,
        user_context=req.user_context,
    )

    return ChatResponse(
        conversation_id=conversation_id,
        **result,
    )


@app.get("/health")
async def health():
    skills = agent.skills.list_skills()
    return {
        "status": "running",
        "skills_loaded": len(skills),
        "skill_names": skills,
    }
```

**Implementation note:** Ensure the dict returned from `agent.chat()` uses keys that match `ChatResponse` (e.g. map `active_skills_used` from the LLM JSON to `active_skills` before returning).

## 4.2 Skill loader (`agent/skill_loader.py`)

```python
import json
from pathlib import Path


class Skill:
    """Represents a single skill with its metadata, places, and knowledge."""

    def __init__(self, skill_dir: Path):
        # Load metadata
        with open(skill_dir / "skill.json", "r") as f:
            self.meta = json.load(f)

        # Load places
        with open(skill_dir / "places.json", "r") as f:
            self.places = json.load(f)

        # Load expert knowledge
        self.knowledge = (skill_dir / "knowledge.md").read_text()

    @property
    def id(self) -> str:
        return self.meta["id"]

    @property
    def name(self) -> str:
        return self.meta["name"]

    @property
    def icon(self) -> str:
        return self.meta["icon"]

    @property
    def triggers(self) -> list[str]:
        return self.meta["triggers"]

    @property
    def vibes(self) -> list[str]:
        return self.meta["vibes"]

    @property
    def combines_well_with(self) -> list[str]:
        return self.meta.get("combines_well_with", [])


class SkillLoader:
    """Loads all skills from disk and matches them to user messages."""

    def __init__(self, skills_dir: str = "skills"):
        self.skills: dict[str, Skill] = {}
        skills_path = Path(skills_dir)

        if not skills_path.exists():
            print(f"⚠️  Skills directory not found: {skills_path}")
            return

        for skill_dir in sorted(skills_path.iterdir()):
            if skill_dir.is_dir() and (skill_dir / "skill.json").exists():
                try:
                    skill = Skill(skill_dir)
                    self.skills[skill.id] = skill
                    places_count = len(skill.places.get("places", []))
                    print(f"  ✅ {skill.icon} {skill.name} ({places_count} places)")
                except Exception as e:
                    print(f"  ❌ Failed to load {skill_dir.name}: {e}")

        print(f"\n📦 Loaded {len(self.skills)} skills total")

    def list_skills(self) -> list[str]:
        return [s.name for s in self.skills.values()]

    def match_skills(self, text: str) -> list[Skill]:
        """Find which skills are relevant to user's text.

        Returns skills sorted by relevance score (highest first).
        """
        text_lower = text.lower()
        scored: list[tuple[float, Skill]] = []

        for skill in self.skills.values():
            score = 0.0

            # Check trigger words (high weight)
            for trigger in skill.triggers:
                if trigger.lower() in text_lower:
                    score += 2.0

            # Check vibe words (lower weight)
            for vibe in skill.vibes:
                if vibe.lower() in text_lower:
                    score += 0.5

            if score > 0:
                scored.append((score, skill))

        # Sort by score descending
        scored.sort(key=lambda x: x[0], reverse=True)
        return [skill for _, skill in scored]

    def build_context_for_skills(self, matched_skills: list[Skill]) -> str:
        """Build the knowledge context string to inject into LLM prompt.

        If skills matched: include those skills' knowledge + places.
        If no match: include ALL places (general discovery mode).
        """
        if not matched_skills:
            return self._build_general_context()

        parts = []
        for skill in matched_skills[:3]:  # max 3 skills to avoid context bloat
            places_json = json.dumps(skill.places["places"], indent=2)
            parts.append(
                f"## ACTIVE SKILL: {skill.icon} {skill.name}\n\n"
                f"### Expert Knowledge\n{skill.knowledge}\n\n"
                f"### Available Places\n```json\n{places_json}\n```"
            )

        return "\n\n---\n\n".join(parts)

    def _build_general_context(self) -> str:
        """When no specific skill matches, provide all places."""
        all_places = []
        for skill in self.skills.values():
            for place in skill.places.get("places", []):
                place_with_skill = {**place, "_skill": skill.id}
                all_places.append(place_with_skill)

        return (
            "## GENERAL DISCOVERY MODE\n"
            "No specific expertise matched. Here are all known places:\n\n"
            f"```json\n{json.dumps(all_places, indent=2)}\n```"
        )

    def get_skill_summaries(self) -> str:
        """One-line summary of each skill, for the system prompt."""
        lines = []
        for skill in self.skills.values():
            places_count = len(skill.places.get("places", []))
            lines.append(
                f"- {skill.icon} **{skill.name}** ({places_count} places): "
                f"{skill.meta['description']}"
            )
        return "\n".join(lines)
```

## 4.3 Zagreb agent (`agent/zagreb_agent.py`)

```python
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

from skill_loader import SkillLoader

# Gemini via Google Cloud
import vertexai
from vertexai.generative_models import GenerativeModel, Part


class ZagrebAgent:
    def __init__(self):
        # Initialize Gemini
        vertexai.init()
        self.model = GenerativeModel("gemini-2.0-flash")

        # Load skills
        print("🏙️ Zagreb Buddy — Loading skills...")
        self.skills = SkillLoader("skills")

        # Load base system prompt
        self.base_system_prompt = Path("system_prompt.md").read_text()

        # In-memory conversation storage (no persistence, no user data)
        self.sessions: dict[str, list[dict]] = defaultdict(list)

        print("🚀 Zagreb Buddy ready!\n")

    def _build_full_prompt(self, matched_skills: list, user_context: dict | None) -> str:
        """Assemble the complete system prompt with dynamic context."""

        now = datetime.now()

        # Dynamic context
        time_context = (
            f"- Current time: {now.strftime('%H:%M')}\n"
            f"- Day: {now.strftime('%A')}\n"
            f"- Date: {now.strftime('%Y-%m-%d')}\n"
        )

        if user_context and user_context.get("lat"):
            time_context += (
                f"- User location: {user_context['lat']}, {user_context['lng']}\n"
            )

        # Skill context
        skill_names = [s.name for s in matched_skills] if matched_skills else ["General"]
        skill_context = self.skills.build_context_for_skills(matched_skills)

        # Assemble
        full_prompt = f"""{self.base_system_prompt}

## YOUR AVAILABLE SKILLS
{self.skills.get_skill_summaries()}

## CURRENTLY ACTIVE: {', '.join(skill_names)}

## CURRENT CONTEXT
{time_context}

## ACTIVE SKILL DATA
{skill_context}

## RESPONSE FORMAT
You MUST respond with valid JSON matching this exact schema:
{{
  "message": "your conversational response as a friendly local",
  "itinerary": null OR {{
    "places": [
      {{
        "id": "place-id",
        "name": "Place Name",
        "lat": 45.xxxx,
        "lng": 15.xxxx,
        "one_liner": "short description",
        "why_recommended": "why this place for this person",
        "practical_tip": "what to do when they get there",
        "visit_duration_min": 20,
        "category": "cafe|street_art|bar|viewpoint|market|architecture|courtyard"
      }}
    ],
    "total_duration_min": 90,
    "total_walking_min": 20,
    "weather_note": null or "relevant weather info"
  }},
  "follow_ups": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "active_skills_used": ["skill_id_1"],
  "needs_more_info": false
}}

IMPORTANT: Return ONLY the JSON object. No markdown code blocks. No extra text.
"""
        return full_prompt

    async def chat(self, message: str, session_id: str, user_context: dict | None = None) -> dict:
        """Process a user message and return agent response."""

        # Get conversation history
        history = self.sessions[session_id]

        # Match skills from current message + recent history
        context_text = message
        if history:
            recent = " ".join(m["content"] for m in history[-4:])
            context_text = recent + " " + message

        matched_skills = self.skills.match_skills(context_text)

        # Build prompt
        system_prompt = self._build_full_prompt(matched_skills, user_context)

        # Build conversation for Gemini
        gemini_history = []
        for msg in history[-10:]:  # last 10 messages for context
            role = "user" if msg["role"] == "user" else "model"
            gemini_history.append({"role": role, "parts": [msg["content"]]})

        # Call Gemini
        chat = self.model.start_chat(history=gemini_history)

        full_message = f"System instructions:\n{system_prompt}\n\nUser message:\n{message}"

        response = chat.send_message(full_message)
        response_text = response.text.strip()

        # Parse JSON response
        try:
            # Clean potential markdown wrapping
            if response_text.startswith("```"):
                response_text = response_text.split("\n", 1)[1].rsplit("```", 1)[0]
            result = json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback if LLM doesn't return valid JSON
            result = {
                "message": response_text,
                "itinerary": None,
                "follow_ups": [],
                "active_skills_used": [],
                "needs_more_info": False,
            }

        # Update session history
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": result.get("message", "")})

        # Trim history to last 20 messages
        if len(history) > 20:
            self.sessions[session_id] = history[-20:]

        return result
```

## 4.4 System prompt (`agent/system_prompt.md`)

```markdown
# You are Zagreb Buddy

You are an AI that embodies a passionate, born-and-raised Zagrepčanin
(person from Zagreb) who LOVES showing people the real side of the city.

## Your Personality
- Warm, enthusiastic, and slightly opinionated — like a real local
- You have personal favorites and you're not afraid to recommend them
- You tell mini-stories about places, not dry facts
- You speak casually, like a friend texting — not like a guidebook
- You use occasional Croatian words naturally (with translation)
- You gently steer people AWAY from tourist traps toward real gems
- You're proud of Zagreb but honest about its quirks

## How You Behave

### When someone tells you what they want:
1. If you have enough info (time + some interest/mood), recommend immediately
2. Include 3-4 places maximum per response (quality over quantity)
3. Order them as a logical walking route
4. Share a personal story or insider tip for each place
5. End with ONE follow-up question or suggestion to keep exploring

### When someone is vague:
1. Don't bombard them with questions
2. Give a quick recommendation based on what you CAN infer
3. Ask ONE smart follow-up to personalize further
4. Offer mood options: "Are you feeling adventurous or more chill today?"

### What you NEVER do:
- Never recommend the top 5 Google results for "things to do in Zagreb"
- Never sound like a travel brochure or Wikipedia
- Never list more than 4 places at once (overwhelming)
- Never give a recommendation without a personal touch or story
- Never ask more than one question at a time

## Your Knowledge Style
- You know secret spots: hidden courtyards, back-alley cafés,
  viewpoints only locals know
- You know what makes each neighborhood different
- You factor in practical things: what's open now, weather,
  walking distance
- You know the stories BEHIND places — who opened them,
  why they matter, what happened there
- When places are from your skills database, use the local_story
  and practical_tip fields — they're gold

## Response Guidelines
- Keep messages conversational but not too long (3-4 short paragraphs max)
- Use emoji sparingly and naturally (not every sentence)
- When you recommend places, make the names bold
- Include practical info naturally in the flow, not as a separate list
- The itinerary JSON handles the structured data — your message
  should be the friendly, personal layer on top

## Example Tone
Good: "Oh man, you HAVE to check out Botaničar — it's this tiny
basement café where they roast their own beans and the walls are
covered in zines. Order a turska kava and just watch the art
students argue about Dalí. It's perfection."

Bad: "Botaničar is a café located in the Lower Town area of Zagreb.
It offers specialty coffee and has an artistic atmosphere.
Opening hours: 8:00-22:00."
```
