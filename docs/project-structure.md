# Project structure

Full file tree as specified for the repository.

```
zagreb-buddy/
│
├── frontend/                          # Next.js app
│   ├── app/
│   │   ├── layout.tsx                 # Root layout + PWA meta
│   │   ├── page.tsx                   # Main app (single page)
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts           # Proxy to VPS
│   │
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatWindow.tsx         # Message list + scroll
│   │   │   ├── MessageBubble.tsx      # Single message (user/bot)
│   │   │   ├── ChatInput.tsx          # Text input + send button
│   │   │   ├── MoodSelector.tsx       # Quick mood pills
│   │   │   ├── FollowUpButtons.tsx    # Suggested next messages
│   │   │   └── TypingIndicator.tsx    # "Zagreb Buddy is thinking..."
│   │   │
│   │   ├── Map/
│   │   │   └── ZagrebMap.tsx          # Leaflet map with pins
│   │   │
│   │   └── Places/
│   │       └── PlaceCard.tsx          # Expandable place detail
│   │
│   ├── lib/
│   │   ├── api.ts                     # Chat API client
│   │   └── types.ts                   # TypeScript types
│   │
│   ├── public/
│   │   ├── manifest.json              # PWA manifest
│   │   ├── icon-192.png               # App icon
│   │   └── icon-512.png               # App icon large
│   │
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── agent/                             # Python backend
│   ├── main.py                        # FastAPI server entry
│   ├── system_prompt.md               # Agent personality
│   │
│   ├── skills/
│   │   ├── graffiti/
│   │   │   ├── skill.json             # Metadata + triggers
│   │   │   ├── places.json            # Place data
│   │   │   └── knowledge.md           # Expert knowledge
│   │   │
│   │   ├── architecture/
│   │   │   ├── skill.json
│   │   │   ├── places.json
│   │   │   └── knowledge.md
│   │   │
│   │   ├── local_bars/
│   │   │   ├── skill.json
│   │   │   ├── places.json
│   │   │   └── knowledge.md
│   │   │
│   │   ├── coffee_culture/
│   │   │   ├── skill.json
│   │   │   ├── places.json
│   │   │   └── knowledge.md
│   │   │
│   │   ├── hidden_courtyards/
│   │   │   ├── skill.json
│   │   │   ├── places.json
│   │   │   └── knowledge.md
│   │   │
│   │   └── food_markets/
│   │       ├── skill.json
│   │       ├── places.json
│   │       └── knowledge.md
│   │
│   ├── skill_loader.py                # Loads + matches skills
│   ├── zagreb_agent.py                # Main agent logic
│   │
│   ├── requirements.txt
│   └── .env                           # GOOGLE_CLOUD_PROJECT, etc.
│
└── docs/
    ├── INDEX.md
    ├── overview.md
    ├── architecture.md
    └── ...                            # Other documentation files
```
