import { NextRequest, NextResponse } from 'next/server';
import { runAgent, buildRegistry } from '@/agent';
import type { Message } from '@/agent/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] };
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        reply: 'No ANTHROPIC_API_KEY set. Add it to your environment to enable live reasoning.',
      });
    }
    const registry = buildRegistry();
    const reply = await runAgent(messages, registry);
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ reply: `Agent error: ${e?.message ?? 'unknown'}` }, { status: 500 });
  }
}
