import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users — admin-only user list.
 *
 * Returns the admin allowlist today and is structured to swap in a real DB
 * query (paginated) once users are persisted. Guarded by requireAdmin.
 */
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .map((email) => ({ email, role: "admin" as const }));

  return Response.json({
    ok: true,
    users: admins,
    note: "Wire to a paginated DB query when users are persisted.",
    generatedAt: new Date().toISOString(),
  });
}
