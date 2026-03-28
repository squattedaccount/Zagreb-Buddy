# Architecture

## System diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           USER                                   │
│                       (mobile browser)                           │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────┐             │
│  │          VERCEL (Buddy — Next.js 16 Frontend)   │             │
│  │                                                 │             │
│  │  ┌───────────────────────────────────────────┐  │             │
│  │  │  App Pages                                │  │             │
│  │  │  ├── Chat Interface                       │  │             │
│  │  │  ├── Interactive Map (Leaflet)            │  │             │
│  │  │  ├── Mood Selector                        │  │             │
│  │  │  └── Place Cards                          │  │             │
│  │  └───────────────────────────────────────────┘  │             │
│  │                                                 │             │
│  │  ┌───────────────────────────────────────────┐  │             │
│  │  │  API Route Handlers                       │  │             │
│  │  │  ├── /api/chat → proxy to VPS             │  │             │
│  │  │  ├── /api/google/connect                  │  │             │
│  │  │  ├── /api/google/callback                 │  │             │
│  │  │  ├── /api/google/calendar/events          │  │             │
│  │  │  └── /api/google/maps/route               │  │             │
│  │  └────────────────┬──────────────────────────┘  │             │
│  └───────────────────┼─────────────────────────────┘             │
│                      │                                           │
│                      │  HTTPS                                    │
│                      ▼                                           │
│  ┌─────────────────────────────────────────────────┐             │
│  │          VPS (Agent Backend)                    │             │
│  │                                                 │             │
│  │  ┌───────────────────────────────────────────┐  │             │
│  │  │  FastAPI Server                           │  │             │
│  │  │  ├── POST /chat                           │  │             │
│  │  │  ├── GET  /chat/{id}/history              │  │             │
│  │  │  ├── GET  /health                         │  │             │
│  │  │  ├── Google OAuth endpoints               │  │             │
│  │  │  ├── Google Maps route builder            │  │             │
│  │  │  ├── Google Calendar CRUD                 │  │             │
│  │  │  └── SQLite (sessions, users, tokens)     │  │             │
│  │  └────────────────┬──────────────────────────┘  │             │
│  │                   │                              │             │
│  │  ┌────────────────▼──────────────────────────┐  │             │
│  │  │  ZagrebAgent                              │  │             │
│  │  │  ├── System Prompt (local personality)    │  │             │
│  │  │  ├── Skill Loader (keyword matching)      │  │             │
│  │  │  ├── Context Builder (time/location/mood) │  │             │
│  │  │  └── JSON Response Parser                 │  │             │
│  │  └────────────────┬──────────────────────────┘  │             │
│  │                   │                              │             │
│  │  ┌────────────────▼──────────────────────────┐  │             │
│  │  │  Skills System (6 domains)                │  │             │
│  │  │  ├── graffiti/                            │  │             │
│  │  │  ├── architecture/                        │  │             │
│  │  │  ├── local_bars/                          │  │             │
│  │  │  ├── coffee_culture/                      │  │             │
│  │  │  ├── hidden_courtyards/                   │  │             │
│  │  │  └── food_markets/                        │  │             │
│  │  └────────────────────────────────────────────┘  │             │
│  │                   │                              │             │
│  │                   ▼                              │             │
│  │  ┌────────────────────────────────────────────┐  │             │
│  │  │  Google AI — Gemini 2.5 Flash              │  │             │
│  │  │  + Google Search grounding (live web data) │  │             │
│  │  └────────────────────────────────────────────┘  │             │
│  └─────────────────────────────────────────────────┘             │
│                      │                                           │
│                      ▼                                           │
│  ┌─────────────────────────────────────────────────┐             │
│  │          Google Cloud APIs                      │             │
│  │  ├── Google OAuth 2.0 (user authentication)     │             │
│  │  ├── Google Calendar API (save itineraries)     │             │
│  │  └── Google Maps (walking directions links)     │             │
│  └─────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

## Tech stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 16 (App Router) | Server-side API proxy, Vercel deploy |
| Styling | Tailwind CSS 4 | Fast, mobile-first |
| Map | Leaflet + react-leaflet | Free, lightweight, interactive |
| Icons | Lucide React | Clean, consistent |
| Backend | FastAPI (Python) | Async, fast, typed |
| AI / LLM | Gemini 2.5 Flash (google-genai SDK) | Fast, large context, free tier |
| Web search | Gemini Google Search grounding | Real-time data without extra APIs |
| Google OAuth | google-auth + google-api-python-client | Calendar integration |
| Google Calendar API | googleapiclient | Save itineraries as events |
| Google Maps | Directions URL builder | Walking routes from itinerary |
| Hosting (frontend) | Vercel | Free, instant deploy |
| Hosting (backend) | VPS | Agent runtime |
| Data | SQLite + JSON/Markdown skill files | Persistent state, simple ops |
