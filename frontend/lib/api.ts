import { ChatResponse } from './types';

export async function sendMessage(
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      throw new Error(`Server error ${res.status}: ${errorBody || res.statusText}`);
    }

    return res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out — the agent is taking too long to respond.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
