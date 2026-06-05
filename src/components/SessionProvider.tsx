"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Client wrapper around NextAuth's SessionProvider so it can be mounted in the
 * root (server) layout. Keeps the layout itself a server component.
 */
export default function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
