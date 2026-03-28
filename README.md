# Zagreb Buddy

**One-liner:** *Like having a local best friend in Zagreb who always knows the perfect spot.*

An AI-powered local companion that helps tourists and locals discover the real Zagreb — hidden gems, local events, street art, secret courtyards, and authentic experiences that never appear on tourist maps.

## Documentation

| Doc | Description |
|-----|-------------|
| [Overview](docs/overview.md) | Problem, solution, value proposition |
| [Architecture](docs/architecture.md) | System diagram, tech stack |
| [Project structure](docs/project-structure.md) | File tree, repo layout |
| [Backend](docs/backend.md) | FastAPI, agent, skill loader |
| [Skills](docs/skills.md) | `skill.json`, `places.json`, `knowledge.md`, build priorities |
| [Frontend](docs/frontend.md) | Next.js, API proxy, types, main UI |
| [User experience](docs/user-experience.md) | Flow from open app to follow-ups |
| [Build plan](docs/build-plan.md) | 5-hour hackathon split |
| [Demo scenarios](docs/demo-scenarios.md) | Tourist, rainy day, local |
| [Future vision](docs/future-vision.md) | MVP → next → long-term |
| [Environment & deployment](docs/environment-and-deployment.md) | Env vars, Vercel/VPS checklist |
| [Presentation outline](docs/PRESENTATION.md) | Pitch deck / meetup slides |

Full index: [docs/INDEX.md](docs/INDEX.md)

## Quick links

- **GitHub:** [github.com/4xon/Zagreb-Buddy](https://github.com/4xon/Zagreb-Buddy)

## Repository layout (target)

```
zagreb-buddy/
├── frontend/     # Next.js app
├── agent/        # FastAPI + ZeroClaw + skills
└── docs/         # This documentation
```

Application source code can live in this repo alongside these docs; the structure above matches the project specification.
