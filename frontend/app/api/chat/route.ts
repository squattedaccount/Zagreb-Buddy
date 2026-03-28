import { NextRequest, NextResponse } from 'next/server';

const AGENT_URL = process.env.AGENT_VPS_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const agentRes = await fetch(`${AGENT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!agentRes.ok) {
        const detail = await agentRes.text().catch(() => 'No details');
        console.error(`Agent returned ${agentRes.status}: ${detail}`);
        return NextResponse.json(
          { error: 'Agent unavailable', detail },
          { status: 502 }
        );
      }

      const data = await agentRes.json();
      return NextResponse.json(data);
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Agent timeout' },
          { status: 504 }
        );
      }
      throw err;
    }
  } catch (err) {
    console.error('Chat proxy error:', err);
    return NextResponse.json(
      { error: 'Failed to reach agent' },
      { status: 500 }
    );
  }
}
