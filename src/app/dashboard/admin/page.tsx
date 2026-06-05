import { requireAdmin } from "@/lib/auth/require-admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

/**
 * /dashboard/admin — server-rendered admin page.
 *
 * Server-side guarded: non-admins (or signed-out users) see a 403 panel with a
 * sign-in link instead of the dashboard. Admins see live runtime stats.
 */
export default async function AdminPage() {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-neutral-500">
            You don’t have permission to view this page. Sign in with an admin
            account (configured via ADMIN_EMAILS).
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-block rounded-full bg-black px-5 py-2.5 text-white"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const mem = process.memoryUsage();
  const stats = [
    { label: "Node", value: process.version },
    { label: "Uptime", value: `${Math.round(process.uptime())}s` },
    { label: "RSS", value: `${Math.round(mem.rss / 1024 / 1024)} MB` },
    { label: "Env", value: process.env.NODE_ENV ?? "unknown" },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-neutral-500">Signed in as {guard.email}</p>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-neutral-400">
              {s.label}
            </div>
            <div className="mt-1 text-lg font-medium">{s.value}</div>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">APIs</h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-600">
          <li>
            <code className="rounded bg-neutral-100 px-1.5 py-0.5">
              GET /api/admin/stats
            </code>{" "}
            — runtime + counts (admin-only)
          </li>
          <li>
            <code className="rounded bg-neutral-100 px-1.5 py-0.5">
              GET /api/admin/users
            </code>{" "}
            — user list (admin-only)
          </li>
        </ul>
      </section>
    </main>
  );
}
