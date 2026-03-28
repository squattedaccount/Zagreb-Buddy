import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

from skill_loader import SkillLoader

import vertexai
from vertexai.generative_models import GenerativeModel


class ZagrebAgent:
    def __init__(self):
        vertexai.init()
        self.model = GenerativeModel("gemini-2.0-flash")

        print("🏙️ Zagreb Buddy — Loading skills...")
        self.skills = SkillLoader("skills")

        self.base_system_prompt = Path("system_prompt.md").read_text()

        self.sessions: dict[str, list[dict]] = defaultdict(list)

        print("🚀 Zagreb Buddy ready!\n")

    def _build_full_prompt(self, matched_skills: list, user_context: dict | None) -> str:
        """Assemble the complete system prompt with dynamic context."""
        now = datetime.now()

        time_context = (
            f"- Current time: {now.strftime('%H:%M')}\n"
            f"- Day: {now.strftime('%A')}\n"
            f"- Date: {now.strftime('%Y-%m-%d')}\n"
        )

        if user_context and user_context.get("lat"):
            time_context += (
                f"- User location: {user_context['lat']}, {user_context['lng']}\n"
            )

        skill_names = [s.name for s in matched_skills] if matched_skills else ["General"]
        skill_context = self.skills.build_context_for_skills(matched_skills)

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
        history = self.sessions[session_id]

        context_text = message
        if history:
            recent = " ".join(m["content"] for m in history[-4:])
            context_text = recent + " " + message

        matched_skills = self.skills.match_skills(context_text)

        system_prompt = self._build_full_prompt(matched_skills, user_context)

        gemini_history = []
        for msg in history[-10:]:
            role = "user" if msg["role"] == "user" else "model"
            gemini_history.append({"role": role, "parts": [msg["content"]]})

        chat = self.model.start_chat(history=gemini_history)

        full_message = f"System instructions:\n{system_prompt}\n\nUser message:\n{message}"

        response = chat.send_message(full_message)
        response_text = response.text.strip()

        try:
            if response_text.startswith("```"):
                response_text = response_text.split("\n", 1)[1].rsplit("```", 1)[0]
            result = json.loads(response_text)
        except json.JSONDecodeError:
            result = {
                "message": response_text,
                "itinerary": None,
                "follow_ups": [],
                "active_skills_used": [],
                "needs_more_info": False,
            }

        # Normalize key name for the API response
        if "active_skills_used" in result:
            result["active_skills"] = result.pop("active_skills_used")

        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": result.get("message", "")})

        if len(history) > 20:
            self.sessions[session_id] = history[-20:]

        return result
