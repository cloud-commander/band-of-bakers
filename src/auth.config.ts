import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    // This session callback runs in middleware context and must be lightweight
    // It maps token properties to the session object for use in authorized()
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        if (isLoggedIn) {
          // Check for admin roles
          const user = auth.user as { role?: string };
          const allowedRoles = ["owner", "manager", "staff"];

          if (user.role && allowedRoles.includes(user.role)) {
            return true;
          }

          // Redirect unauthorized users to home
          return Response.redirect(new URL("/", nextUrl));
        }
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
