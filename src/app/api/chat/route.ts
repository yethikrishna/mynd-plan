import { NextRequest } from "next/server";
import { runAgent } from "@/lib/agent/loop";
import { defaultRegistry } from "@/lib/agent/registry";
import { db, dbEnabled } from "@/lib/db/client";
import { conversations, messages as messagesTable } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const body = await req.json();
  const incoming = body.messages || [];

  if (!apiKey) {
    return Response.json({
      error:
        "ANTHROPIC_API_KEY is not set. Add it to your deployment environment to activate the agent. The UI is fully deployed and working.",
    });
  }

  const registry = defaultRegistry();
  const encoder = new TextEncoder();
  const lastUserText = (() => {
    const u = [...incoming].reverse().find((m: any) => m.role === "user");
    return typeof u?.content === "string" ? u.content : "";
  })();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));
      let assistantText = "";
      try {
        for await (const event of runAgent(incoming, registry, apiKey)) {
          if (event.type === "text") assistantText += event.delta;
          send(event);
        }
      } catch (err: any) {
        send({ type: "error", message: err?.message || "Agent failed" });
      } finally {
        if (dbEnabled && db) {
          try {
            const convoId =
              body.conversationId ||
              (
                await db
                  .insert(conversations)
                  .values({ title: lastUserText.slice(0, 60) || "New conversation" })
                  .returning({ id: conversations.id })
              )[0].id;
            await db.insert(messagesTable).values([
              { conversationId: convoId, role: "user", content: lastUserText },
              { conversationId: convoId, role: "assistant", content: assistantText },
            ]);
            send({ type: "conversation", id: convoId });
          } catch {
            // persistence is best-effort and optional
          }
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
