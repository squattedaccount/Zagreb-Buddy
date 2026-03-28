# Build plan (5 hours)

## Work split

**Person A (frontend)**

**Hour 1 — Foundation**

- `npx create-next-app`
- Tailwind config
- Layout + chat UI shell
- TypeScript types
- API proxy route

**Hour 2 — Chat working**

- Chat state management
- Connect to API
- Message bubbles
- Loading / typing indicator
- Follow-up buttons

**Hour 3 — Map + polish**

- Leaflet map component
- Place pins from itinerary
- Mood selector component
- Place cards
- Mobile responsive tweaks

**Hour 4 — Demo ready**

- UI polish + animations
- Welcome message
- Error states
- `manifest.json` (PWA)
- Deploy to Vercel
- Test on real phone

---

**Person B (agent + content)**

**Hour 1 — Agent setup**

- FastAPI on VPS
- Install ZeroClaw + Gemini SDK
- `agent/` directory structure
- Confirm Gemini API responds
- Basic `/chat` endpoint working

**Hour 2 — Skills + system prompt**

- Write `system_prompt.md`
- Build `graffiti/` skill (P0): `skill.json`, `places.json` (6–8 places), `knowledge.md`
- Build `coffee_culture/` skill (P0)
- Test agent response quality

**Hour 3 — More skills + tuning**

- Build `local_bars/` (P1)
- Build `architecture/` (P1)
- Tune system prompt
- Test edge cases
- Fix response format issues

**Hour 4 — Integration testing**

- End-to-end testing with Person A
- Fix agent response parsing
- Add `hidden_courtyards/` if time
- Stabilize VPS
- Joint bug fixes

---

**Hour 5 — Presentation (together)**

- 6–8 slide deck
- Three demo scenarios (see [demo-scenarios.md](demo-scenarios.md))
- Practice pitch (3–5 minutes)
- Buffer for last-minute fixes
