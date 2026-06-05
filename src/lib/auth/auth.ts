import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

/**
 * NextAuth configuration.
 *
 * Two providers ship by default:
 *  - GitHub OAuth (set GITHUB_ID / GITHUB_SECRET to enable)
 *  - Credentials (email-only demo sign-in, always available so the app is
 *    usable the moment it deploys, even before OAuth is configured)
 *
 * The credentials provider is intentionally permissive for the zero-config
 * "click deploy and it just works" path. Swap it for a real password / magic
 * link flow in production by validating against your database.
 */

const githubConfigured = Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  providers: [
    ...(githubConfigured
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        if (!email || !email.includes("@")) return null;
        // Demo path: any valid-looking email creates a session.
        // Replace with a DB lookup + password/magic-link check in production.
        return {
          id: email,
          email,
          name: email.split("@")[0],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        (session.user as { id?: string }).id = token.uid as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
