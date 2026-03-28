'use client';

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-shrink-0 border-t border-slate-800 bg-slate-900 px-3 py-3"
    >
      <div className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask your Zagreb buddy..."
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 flex items-center justify-center transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
}
