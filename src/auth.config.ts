import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    // signIn: "/auth/login", // Removed to use default Cognito Hosted UI
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
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isLoggedIn) {
        const user = auth.user as { role?: string; is_banned?: boolean };

        // Block banned users immediately
        if (user.is_banned) {
          return false; // Redirect to login (or could be a specific banned page)
        }
      }

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

      if (isOnAuth) {
        if (isLoggedIn) {
          // Only redirect if user has a role (fully authenticated)
          // If they don't have a role, they might be in a bad state and need to re-login
          const user = auth.user as { role?: string };
          if (user.role) {
            return Response.redirect(new URL("/", nextUrl));
          }
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
