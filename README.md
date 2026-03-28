# Buddy

**Like having a local best friend who always knows the perfect spot.**

An AI-powered local companion that helps both tourists and locals discover the real Zagreb — hidden gems, street art, secret courtyards, and authentic experiences that never appear on tourist maps.

## Google Technologies Used

- **Gemini 2.5 Flash** — powers all AI conversations via `google-genai` SDK
- **Google Search grounding** — real-time web data in every response
- **Google OAuth 2.0** — secure user authentication
- **Google Calendar API** — save itineraries as calendar events
- **Google Maps** — walking direction URLs from itinerary places

## How It Works

```
Mobile Browser → Next.js 16 (Vercel) → FastAPI (VPS) → Gemini 2.5 Flash
                                             ↕              ↕
                                        Skills System   Google Search
                                        SQLite           grounding
                                        Google OAuth
                                        Calendar API
                                        Maps URLs
```

1. User chats with the AI agent in natural language
2. The agent matches relevant **skills** (street art, coffee, architecture, bars, courtyards, markets)
3. **Gemini 2.5 Flash** generates a personalized response with optional walking itinerary
4. Places appear on an **interactive map** with local stories and tips
5. Users can open the route in **Google Maps** or save it to **Google Calendar**

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Map | Leaflet + react-leaflet |
| Backend | FastAPI, Python 3.12 |
| AI | Gemini 2.5 Flash + Google Search grounding |
| Integrations | Google OAuth 2.0, Calendar API, Maps |
| Database | SQLite |
| Hosting | Vercel (frontend) + VPS (backend) |

## Key Numbers

- **6** specialized skill domains
- **38** curated hidden gems with local stories
- **5** Google technologies integrated

## Repository Layout

```
buddy/
├── frontend/        # Next.js app (Vercel)
├── agent/           # FastAPI + ZagrebAgent + skills
│   ├── skills/      # 6 knowledge domains (38 places)
│   ├── storage/     # SQLite persistence
│   └── main.py      # FastAPI server
└── docs/            # Documentation & presentation
```

## Documentation

| Doc | Description |
|-----|-------------|
| [Overview](docs/overview.md) | Problem, solution, value proposition |
| [Architecture](docs/architecture.md) | System diagram, tech stack |
| [Presentation](docs/PRESENTATION.md) | Hackathon pitch deck (3-4 min) |
| [Hackathon Answers](docs/hackathon-answers.md) | Google Prize, problem, solution |
| [Skills](docs/skills.md) | Skill schema, places schema, priorities |
| [Google Integrations](docs/google-integrations.md) | OAuth, Calendar, Maps API docs |
| [Demo Scenarios](docs/demo-scenarios.md) | Tourist, rainy day, local |
| [Future Vision](docs/future-vision.md) | MVP → next → long-term roadmap |

## Quick Start

**Backend:**
```bash
cd agent
cp .env.example .env   # add your GEMINI_API_KEY
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Links

- **Live:** [zagrebbuddy.vercel.app](https://zagrebbuddy.vercel.app)
- **GitHub:** [github.com/squattedaccount/Zagreb-Buddy](https://github.com/squattedaccount/Zagreb-Buddy)
