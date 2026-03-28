'use client';

const MOODS = [
  { emoji: '☕', label: 'Chill', message: "I'm feeling chill, show me something relaxed" },
  { emoji: '🎨', label: 'Culture', message: "I'm in the mood for art and culture" },
  { emoji: '🍺', label: 'Night Out', message: "I want to go out tonight, where should I drink?" },
  { emoji: '🤫', label: 'Hidden Gems', message: "Surprise me with something hidden and secret" },
  { emoji: '🥐', label: 'Foodie', message: "I'm hungry, show me the best local food" },
  { emoji: '🏛️', label: 'History', message: "I want to see beautiful architecture and history" },
];

interface MoodSelectorProps {
  onSelect: (text: string) => void;
}

export function MoodSelector({ onSelect }: MoodSelectorProps) {
  return (
    <div className="flex-shrink-0 px-4 py-3 border-t border-slate-800">
      <p className="text-xs text-slate-400 mb-2 text-center">What are you in the mood for?</p>
      <div className="flex flex-wrap justify-center gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            onClick={() => onSelect(mood.message)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/40 transition-colors text-sm"
          >
            <span>{mood.emoji}</span>
            <span className="text-slate-300">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
