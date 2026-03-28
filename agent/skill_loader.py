import json
from pathlib import Path


class Skill:
    """Represents a single skill with its metadata, places, and knowledge."""

    def __init__(self, skill_dir: Path):
        with open(skill_dir / "skill.json", "r") as f:
            self.meta = json.load(f)

        with open(skill_dir / "places.json", "r") as f:
            self.places = json.load(f)

        self.knowledge = (skill_dir / "knowledge.md").read_text()

    @property
    def id(self) -> str:
        return self.meta["id"]

    @property
    def name(self) -> str:
        return self.meta["name"]

    @property
    def icon(self) -> str:
        return self.meta["icon"]

    @property
    def triggers(self) -> list[str]:
        return self.meta["triggers"]

    @property
    def vibes(self) -> list[str]:
        return self.meta["vibes"]

    @property
    def combines_well_with(self) -> list[str]:
        return self.meta.get("combines_well_with", [])


class SkillLoader:
    """Loads all skills from disk and matches them to user messages."""

    def __init__(self, skills_dir: str = "skills"):
        self.skills: dict[str, Skill] = {}
        skills_path = Path(skills_dir)

        if not skills_path.exists():
            print(f"⚠️  Skills directory not found: {skills_path}")
            return

        for skill_dir in sorted(skills_path.iterdir()):
            if skill_dir.is_dir() and (skill_dir / "skill.json").exists():
                try:
                    skill = Skill(skill_dir)
                    self.skills[skill.id] = skill
                    places_count = len(skill.places.get("places", []))
                    print(f"  ✅ {skill.icon} {skill.name} ({places_count} places)")
                except Exception as e:
                    print(f"  ❌ Failed to load {skill_dir.name}: {e}")

        print(f"\n📦 Loaded {len(self.skills)} skills total")

    def list_skills(self) -> list[str]:
        return [s.name for s in self.skills.values()]

    def match_skills(self, text: str) -> list[Skill]:
        """Find which skills are relevant to user's text.
        Returns skills sorted by relevance score (highest first).
        """
        text_lower = text.lower()
        scored: list[tuple[float, Skill]] = []

        for skill in self.skills.values():
            score = 0.0

            for trigger in skill.triggers:
                if trigger.lower() in text_lower:
                    score += 2.0

            for vibe in skill.vibes:
                if vibe.lower() in text_lower:
                    score += 0.5

            if score > 0:
                scored.append((score, skill))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [skill for _, skill in scored]

    def build_context_for_skills(self, matched_skills: list[Skill]) -> str:
        """Build the knowledge context string to inject into LLM prompt."""
        if not matched_skills:
            return self._build_general_context()

        parts = []
        for skill in matched_skills[:3]:
            places_json = json.dumps(skill.places["places"], indent=2)
            parts.append(
                f"## ACTIVE SKILL: {skill.icon} {skill.name}\n\n"
                f"### Expert Knowledge\n{skill.knowledge}\n\n"
                f"### Available Places\n```json\n{places_json}\n```"
            )

        return "\n\n---\n\n".join(parts)

    def _build_general_context(self) -> str:
        """When no specific skill matches, provide all places."""
        all_places = []
        for skill in self.skills.values():
            for place in skill.places.get("places", []):
                place_with_skill = {**place, "_skill": skill.id}
                all_places.append(place_with_skill)

        return (
            "## GENERAL DISCOVERY MODE\n"
            "No specific expertise matched. Here are all known places:\n\n"
            f"```json\n{json.dumps(all_places, indent=2)}\n```"
        )

    def get_skill_summaries(self) -> str:
        """One-line summary of each skill, for the system prompt."""
        lines = []
        for skill in self.skills.values():
            places_count = len(skill.places.get("places", []))
            lines.append(
                f"- {skill.icon} **{skill.name}** ({places_count} places): "
                f"{skill.meta['description']}"
            )
        return "\n".join(lines)
