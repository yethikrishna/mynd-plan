import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Server-side admin guard.
 *
 * ADMIN_EMAILS is a comma-separated allowlist (e.g. "you@co.com,ops@co.com").
 * If unset, NO ONE is admin — fail closed. Returns the session on success or
 * a Response (401/403) the caller should return directly.
 */
export async function requireAdmin(): Promise<
  | { ok: true; email: string }
  | { ok: false; response: Response }
> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  const allow = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allow.includes(email)) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  return { ok: true, email };
}
