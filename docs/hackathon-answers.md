# Hackathon Submission Answers

---

## How did you use Google Technology? (Required for Google Prize)

Buddy is built on **five Google technologies** working together as the core of the application:

**1. Google Gemini 2.5 Flash (AI/LLM)**  
Gemini powers every conversation in our app. We use the `google-genai` Python SDK to send user messages along with a rich system prompt containing local knowledge, skill data, and context (time of day, mood, location). Gemini returns structured JSON responses that include conversational text, place recommendations, walking itineraries, and follow-up suggestions — all in a single call. Gemini's large context window lets us inject 38 curated places with full descriptions, local stories, and practical tips into each request.

**2. Google Search Grounding (Real-time web data)**  
We enable Gemini's built-in Google Search grounding tool (`types.Tool(google_search=types.GoogleSearch())`) in every request. This means the AI can automatically search the web when users ask about current events, festivals, opening hours, weather, or anything that needs live data — without us needing a separate search API. The agent seamlessly weaves real-time information into its responses as if it "just checked."

**3. Google OAuth 2.0 (User Authentication)**  
Users can connect their Google account through a standard OAuth 2.0 flow. We handle the authorization URL generation, code exchange, and secure token storage (with automatic refresh) in our backend. This unlocks personalized features like calendar integration.

**4. Google Calendar API (Save Itineraries)**  
After the AI generates a walking itinerary, users can save it directly to their Google Calendar with one tap. We use `google-api-python-client` to create calendar events with the itinerary title, description, location, and time blocks. Users can also update events if they change their plans.

**5. Google Maps (Walking Directions)**  
We programmatically build Google Maps walking direction URLs from the itinerary places. When a user gets a 3-stop walking route, they can tap "Open in Google Maps" and it opens with origin, destination, and all waypoints pre-filled — ready for turn-by-turn navigation.

---

## What problem did you solve?

**The gap between what search engines show and what locals actually know about their city.**

Every city has two versions: the one that appears on Google (the same recycled attractions) and the one that locals live (hidden courtyards, the café where they actually roast their own beans, the street art alley that changes every week). This real, living knowledge exists in people's heads but doesn't make it into search engines or travel apps.

This problem affects **two audiences equally:**

- **Tourists** get generic, recycled recommendations — tourist traps that rank high on SEO but don't reflect what makes a city special. They can't find what's happening *right now*, and they have no local context or stories behind places.

- **Locals** fall into routines and stop exploring their own city. They walk past hidden courtyards every day without stepping inside. They don't know what new bar opened, what event is happening this weekend, or what hidden gems exist in neighborhoods they've never explored. No existing tool is designed to help locals *rediscover* where they live.

There's no tool that combines curated local knowledge, real-time awareness, and conversational interaction in a way that serves **both tourists discovering a city and locals rediscovering it**.

---

## How did you solve it?

We built **Buddy** — a chat-first AI agent that acts as a knowledgeable local friend for both visitors and residents.

**The key insight:** instead of building another search-and-list travel app, we created a conversational companion with a curated, structured knowledge base and a distinct personality — one that works equally well whether you just arrived or you've lived here for 5 years.

**How it works:**

1. **Modular Skills System** — We built 6 knowledge domains (street art, coffee culture, architecture, local bars, hidden courtyards, food & markets), each containing curated places with GPS coordinates, local stories, practical tips, opening hours, vibe tags, and weather suitability. The system automatically activates relevant skills based on what the user is talking about.

2. **Gemini-powered Conversations** — Gemini 2.5 Flash receives the system prompt (personality + behavior rules), matched skill data (places + expert knowledge), and user context (time, mood, location). It returns structured JSON with a conversational message, an optional walking itinerary, and follow-up suggestions.

3. **Google Search Grounding** — Every response can incorporate real-time web data. If someone asks "what's happening in Zagreb tonight?", Gemini searches the web automatically and weaves current events into its answer.

4. **Interactive Map + Itineraries** — When the agent recommends places, they appear as pins on a Leaflet map with a walking route. Each place has a card with the local story and a practical tip.

5. **Google Ecosystem Integration** — Users can save itineraries to Google Calendar and open walking routes in Google Maps. The agent's recommendations become actionable, not just informational.

6. **Serves Both Audiences** — A tourist can say "I have 2 hours, show me street art" and get a walking route. A local can say "I've lived here 5 years, surprise me" and the agent picks the most hidden spots (tourist_level 1-2) that even long-time residents haven't seen. The same system, the same personality, adapted to context.

**Architecture:** Next.js 16 frontend on Vercel (handles API proxying and UI), FastAPI backend on a VPS (runs the agent and integrations), Gemini 2.5 Flash for AI (with Google Search grounding), SQLite for persistence, and modular skill files (JSON + Markdown) for the knowledge base.
