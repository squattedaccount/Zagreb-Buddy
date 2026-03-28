# Frontend implementation

## 6.1 API proxy route (`app/api/chat/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';

const AGENT_URL = process.env.AGENT_VPS_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const agentRes = await fetch(`${AGENT_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!agentRes.ok) {
      return NextResponse.json(
        { error: 'Agent unavailable' },
        { status: 502 }
      );
    }

    const data = await agentRes.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reach agent' },
      { status: 500 }
    );
  }
}
```

## 6.2 TypeScript types (`lib/types.ts`)

```typescript
export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  one_liner: string;
  why_recommended: string;
  practical_tip: string;
  visit_duration_min: number;
  category: string;
}

export interface Itinerary {
  places: Place[];
  total_duration_min: number;
  total_walking_min: number;
  weather_note: string | null;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  itinerary: Itinerary | null;
  follow_ups: string[];
  active_skills: string[];
  needs_more_info: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  itinerary?: Itinerary | null;
  follow_ups?: string[];
  timestamp: Date;
}
```

## 6.3 API client (`lib/api.ts`)

```typescript
import { ChatResponse } from './types';

export async function sendMessage(
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to get response');
  }

  return res.json();
}
```

## 6.4 Main page (`app/page.tsx`)

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import { sendMessage } from '@/lib/api';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import { ChatInput } from '@/components/Chat/ChatInput';
import { MoodSelector } from '@/components/Chat/MoodSelector';
import { ZagrebMap } from '@/components/Map/ZagrebMap';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bok! 👋 I'm your Zagreb Buddy — think of me as a local friend who knows all the best hidden spots. What are you in the mood for today?",
      follow_ups: [
        "I have 2 hours to explore",
        "Show me hidden gems near the center",
        "What's happening today?",
      ],
      timestamp: new Date(),
    },
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItinerary, setActiveItinerary] = useState(null);

  const handleSend = async (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendMessage(text, conversationId || undefined);

      setConversationId(response.conversation_id);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        itinerary: response.itinerary,
        follow_ups: response.follow_ups,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

      if (response.itinerary) {
        setActiveItinerary(response.itinerary);
      }
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble right now. Try again in a moment! 🙏",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-950 text-white">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
        <span className="text-2xl">🏙️</span>
        <div>
          <h1 className="font-bold text-lg leading-tight">Zagreb Buddy</h1>
          <p className="text-xs text-slate-400">Your AI local friend</p>
        </div>
      </header>

      {/* Messages */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Map (shows when itinerary exists) */}
      {activeItinerary && (
        <div className="flex-shrink-0 h-48 border-t border-slate-800">
          <ZagrebMap itinerary={activeItinerary} />
        </div>
      )}

      {/* Mood selector (only show at start) */}
      {messages.length <= 1 && (
        <MoodSelector onSelect={handleSend} />
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
```

**Typing note:** `activeItinerary` should be typed as `Itinerary | null` (or `undefined`) to match `ZagrebMap` props.

## 6.5 PWA layout (`app/layout.tsx`)

```tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zagreb Buddy — Your AI Local Friend',
  description: 'Discover the real Zagreb with your AI local companion',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Zagreb Buddy',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-slate-950 overscroll-none">{children}</body>
    </html>
  );
}
```
