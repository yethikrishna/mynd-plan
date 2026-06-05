import "next-auth";

/**
 * Augment NextAuth's Session/User so `session.user.id` is typed everywhere
 * instead of needing a cast. The id is populated from the jwt callback in
 * src/lib/auth/auth.ts.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
  }
}
