# User experience flow

```
USER OPENS APP
│
▼
┌──────────────────────────────────────┐
│  Welcome message from Buddy          │
│  + mood selector pills               │
│  ☕Chill  🎨Culture  🍺Night  🤫Hidden │
└──────────────┬───────────────────────┘
               │
               │ User types or taps mood
               ▼
┌──────────────────────────────────────┐
│  Agent checks: do I have enough      │
│  info to recommend?                  │
│                                      │
│  YES → Generate itinerary            │
│  NO  → Ask ONE follow-up question    │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Agent response appears:             │
│  - Conversational message            │
│  - 3-4 place recommendations         │
│  - Map with pins                     │
│  - Follow-up suggestion buttons      │
└──────────────┬───────────────────────┘
               │
               │ User can:
               ├── Tap a follow-up suggestion
               ├── Type a new message
               ├── Tap map pins for details
               ├── Ask for modifications
               │   ("add a food stop")
               │   ("skip the outdoor ones, it's raining")
               └── Start a completely new query
```
