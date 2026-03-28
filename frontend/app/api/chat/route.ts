import { NextRequest, NextResponse } from 'next/server';

const AGENT_URL = process.env.AGENT_VPS_URL || 'http://localhost:8000';

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
  } catch {
    return NextResponse.json(
      { error: 'Failed to reach agent' },
      { status: 500 }
    );
  }
}
