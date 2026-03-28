# Buddy — Hackathon Presentation

**Duration:** 3–4 minutes  
**Format:** Slide-by-slide script with speaker notes

---

## Slide 1: Title (15 seconds)

### Buddy
**Like having a local best friend who always knows the perfect spot.**

*An AI-powered local companion for discovering the real Zagreb.*

**Speaker notes:** "Hi everyone! We built Buddy — an AI local friend that helps you discover the real Zagreb, whether you're visiting for the first time or you've lived here for years."

---

## Slide 2: The Problem (30 seconds)

### Every city has two versions.

**The Tourist Version:**
- Same 5 attractions on every blog
- Google returns tourist traps
- No local context or stories
- No idea what's happening *right now*

**The Local Version:**
- Locals fall into routines and stop exploring their own city
- Hidden gems, events, new openings — hard to discover even for residents
- No tool is built *for locals* to rediscover where they live

**The core gap:** Real local knowledge lives in people's heads — not on the internet.

**Speaker notes:** "If you Google 'things to do in Zagreb,' you get the cathedral, the market, Ban Jelačić square — the same list every time. But the *real* Zagreb is the hidden courtyard with the jazz bar inside, the street art alley that changes every week, the tiny coffee spot where they roast their own beans. And it's not just tourists who miss this — even locals fall into routines. They walk past hidden courtyards every day without stepping inside. We built Buddy to solve both problems."

---

## Slide 3: Our Solution (30 seconds)

### A chat-first AI agent that talks like a local friend.

- **Not a search engine** — a conversational companion with personality
- **6 specialized skill domains:** street art, coffee culture, architecture, local bars, hidden courtyards, food & markets
- **38 curated hidden gems** — each with real local stories, not Wikipedia facts
- **Context-aware:** considers time of day, mood, weather, how much time you have
- **Interactive map** with walking itineraries
- **Works for tourists AND locals** — from "I just arrived" to "I've lived here 5 years, surprise me"

**Speaker notes:** "We built a chat-based AI agent that actually *talks* like a local. It has six specialized knowledge domains with 38 curated places — each with real stories, practical tips, and insider knowledge. Ask it 'I have 2 hours and I love street art' and it builds you a walking route. Or say 'I've lived here 5 years, surprise me' and it finds the most hidden spots even longtime locals haven't seen."

---

## Slide 4: How We Used Google Technology (45 seconds)

### Deep integration with Google's AI and Cloud ecosystem

**1. Gemini 2.5 Flash — the brain**
- Powers all conversations via the `google-genai` SDK
- Understands context, mood, and intent from natural language
- Returns structured JSON responses (itinerary, places, follow-ups)

**2. Google Search grounding — live data**
- Gemini automatically searches the web for real-time info
- Current events, festivals, opening hours, weather — always fresh
- No separate search API needed; built into every response

**3. Google OAuth 2.0 — user connection**
- Users connect their Google account securely
- Enables personalized calendar and maps features

**4. Google Calendar API — save your plans**
- One-tap: save your itinerary as a calendar event
- Includes location, description, and time blocks

**5. Google Maps — navigate your route**
- Auto-generates walking directions URL from itinerary places
- Opens directly in Google Maps with waypoints pre-filled

**Speaker notes:** "Google technology is at the core of everything we do. Gemini 2.5 Flash powers every conversation — it's not just answering questions, it's understanding mood, context, and building structured itineraries. We use Google Search grounding so the AI can pull real-time info about events and opening hours. Users can connect their Google account to save itineraries to Google Calendar with one tap, and we generate Google Maps walking routes automatically from the places we recommend."

---

## Slide 5: Live Demo / Screenshots (45 seconds)

### Two scenarios:

**Tourist:** "I just arrived in Zagreb, I have 2 hours and I love street art and coffee."
**Local:** "I've lived here for 5 years. Surprise me with something I haven't seen."

Show:
1. **Chat** — the agent responds with personality and recommends 3-4 places
2. **Map** — pins appear showing the walking route
3. **Place cards** — each place has a local story and practical tip
4. **Follow-ups** — "Want to extend the route?" / "How about a hidden courtyard nearby?"
5. **Google Maps** — tap to open walking directions
6. **Calendar** — save the plan to your Google Calendar

**Speaker notes:** "Let me show you two scenarios. First, a tourist: 'I have 2 hours, I love street art and coffee' — Buddy activates its graffiti and coffee culture skills, builds a walking route, shows it on the map. Second, a local: 'I've lived here 5 years, surprise me' — Buddy picks the most hidden spots, tourist level 1 places that even locals miss. In both cases you can open the route in Google Maps or save it to your calendar."

---

## Slide 6: Architecture (15 seconds)

```
Mobile Browser → Next.js 16 (Vercel) → FastAPI (VPS) → Gemini 2.5 Flash
                      ↕                    ↕              ↕
                 API Proxy          Skills System    Google Search
                                   SQLite Storage   grounding
                                   Google OAuth
                                   Google Calendar
                                   Google Maps URLs
```

**Speaker notes:** "Quick architecture: Next.js frontend on Vercel, FastAPI backend on a VPS, Gemini 2.5 Flash for AI, with Google Calendar and Maps integration. The skills system is a modular knowledge base — each skill has its own places, stories, and trigger words."

---

## Slide 7: What's Next (15 seconds)

- **Community contributions** — locals submit their favorite spots
- **Live event scraping** — what's happening tonight?
- **Multi-language** — Croatian + English
- **Per-user memory** — the agent learns your preferences
- **Scale to other cities** — same framework, new skill packs

**Speaker notes:** "Next steps: we want locals to contribute their own spots, add live event data, support Croatian language, and eventually scale this to other cities using the same modular skill framework."

---

## Slide 8: Thank You (15 seconds)

### Buddy

**Try it:** zagrebbuddy.vercel.app  
**Code:** github.com/squattedaccount/Zagreb-Buddy

*Built with Gemini 2.5 Flash, Google Calendar API, Google Maps, and a love for Zagreb.*

**Speaker notes:** "Thank you! Buddy is live — try it, explore the real Zagreb, and check out our code. Questions?"

---

## Total timing breakdown

| Slide | Duration | Cumulative |
|-------|----------|------------|
| Title | 15s | 0:15 |
| Problem | 30s | 0:45 |
| Solution | 30s | 1:15 |
| Google Tech | 45s | 2:00 |
| Demo | 45s | 2:45 |
| Architecture | 15s | 3:00 |
| What's Next | 15s | 3:15 |
| Thank You | 15s | 3:30 |

**Total: ~3.5 minutes** (leaves 30s buffer for pauses/transitions)
