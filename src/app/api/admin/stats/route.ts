import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats — admin-only system snapshot.
 *
 * Returns process/runtime health plus placeholders for counts that wire to the
 * DB once you connect it. Guarded by requireAdmin (fails closed).
 */
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const mem = process.memoryUsage();
  return Response.json({
    ok: true,
    runtime: {
      node: process.version,
      uptimeSec: Math.round(process.uptime()),
      rssMb: Math.round(mem.rss / 1024 / 1024),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      env: process.env.NODE_ENV,
    },
    // Wire these to real queries when the DB is connected:
    counts: { users: null, workspaces: null, messages: null },
    generatedAt: new Date().toISOString(),
  });
}
