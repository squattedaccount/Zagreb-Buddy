'use client';

interface FollowUpButtonsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export function FollowUpButtons({ suggestions, onSelect }: FollowUpButtonsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-1">
      {suggestions.map((suggestion, i) => (
        <button
          key={i}
          onClick={() => onSelect(suggestion)}
          className="text-sm px-3 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
