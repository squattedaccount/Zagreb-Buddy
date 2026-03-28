# Skill specification

## 5.1 `skill.json` schema

```json
{
  "id": "string — unique snake_case identifier",
  "name": "string — human readable name",
  "icon": "string — single emoji",
  "color": "string — hex color for UI",
  "description": "string — one sentence about what this skill covers",

  "triggers": [
    "list of lowercase strings",
    "words or phrases that indicate this skill is relevant",
    "aim for 10-15 trigger words per skill"
  ],

  "vibes": [
    "mood words this skill matches",
    "like: artsy, chill, adventurous, romantic, underground"
  ],

  "weather_dependent": "boolean — are these mostly outdoor places?",
  "best_time_of_day": ["morning", "afternoon", "evening", "night"],
  "typical_visit_duration_min": "number — typical time to enjoy this skill's route",

  "combines_well_with": ["other_skill_ids", "that pair nicely"]
}
```

## 5.2 `places.json` schema

```json
{
  "places": [
    {
      "id": "string — unique kebab-case identifier",
      "name": "string — real place name",
      "lat": "number — latitude (e.g., 45.8131)",
      "lng": "number — longitude (e.g., 15.9775)",
      "neighborhood": "string — donji_grad|gornji_grad|trnje|tresnjevka|maksimir|novi_zagreb|other",

      "description": "string — one sentence, what IS this place",
      "local_story": "string — 2-3 sentences, why locals care, personal angle",
      "practical_tip": "string — what to do/order/look for when you arrive",
      "highlights": ["string — notable thing 1", "thing 2", "thing 3"],

      "visit_duration_min": "number — realistic minutes to spend here",
      "tourist_level": "number 1-5 — 1=totally hidden, 5=well known tourist spot",

      "opens": "string 'HH:MM' or null if always open / outdoor",
      "closes": "string 'HH:MM' or null",
      "days_open": ["mon","tue","wed","thu","fri","sat","sun"],

      "is_outdoor": "boolean",
      "free_entry": "boolean",

      "tags": ["searchable", "descriptive", "tags"],
      "vibes": ["artsy", "chill", "adventurous", "romantic", "underground", "family", "quirky"],
      "nearby_ids": ["id-of-place-thats-walking-distance"]
    }
  ]
}
```

## 5.3 `knowledge.md` structure

```markdown
# [Skill Name] — Expert Knowledge

## The Scene
Overview of this topic/culture in Zagreb. 2-3 paragraphs.
What makes Zagreb special for this? History, context.

## Key Names to Know
People, venues, crews, brands relevant to this skill.
The agent drops these names to sound knowledgeable.

## Insider Tips
Things a local would tell a friend. Not on Google.
- Tip 1
- Tip 2
- Tip 3

## Suggested Routes
- **Quick Hit (30 min):** Place A → Place B
- **The Classic (1.5h):** Place A → B → C → D
- **Deep Cut (2.5h):** For the truly curious

## Weather Considerations
What to do when it rains. Alternatives.

## Seasonal Notes
What changes by season. Events, festivals.
```

## 5.4 Skills to build

| Priority | Skill | ID | Places | Notes |
|----------|-------|-----|--------|-------|
| P0 | Street Art & Graffiti | `graffiti` | 6–8 | Strong demo, visual |
| P0 | Coffee Culture | `coffee_culture` | 5–7 | Broad appeal |
| P1 | Local Bars & Nightlife | `local_bars` | 6–8 | Common query |
| P1 | Architecture | `architecture` | 6–8 | Distinctive to Zagreb |
| P2 | Hidden Courtyards | `hidden_courtyards` | 5–7 | “Secret” Zagreb |
| P2 | Food & Markets | `food_markets` | 4–6 | Universal appeal |

- **P0:** Must-have for demo  
- **P1:** Build if time allows  
- **P2:** Nice to have  
