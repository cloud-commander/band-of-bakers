import NextAuth, { type DefaultSession } from "next-auth";
import Cognito from "next-auth/providers/cognito";
import { authConfig } from "./auth.config";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      is_banned?: boolean;
      phone?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    is_banned?: boolean;
    phone_number?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    userId?: string;
    error?: string;
    role?: string;
    is_banned?: boolean;
    name?: string;
    picture?: string;
    phone?: string;
    emailVerified?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_ID,
      issuer: process.env.AUTH_COGNITO_ISSUER,
      client: {
        token_endpoint_auth_method: "none",
      },
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      token: {
        params: {
          client_id: process.env.AUTH_COGNITO_ID,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        // Initial sign in
        if (account && user) {
          // Sync user to D1
          const { syncUser } = await import("./lib/auth/sync-user");

          // Map Cognito profile to User shape expected by syncUser
          // Cognito profile fields: sub, email_verified, phone_number, etc.
          const cognitoUser = {
            ...user,
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: profile?.email_verified as boolean,
            phone: (profile?.phone_number as string) || undefined,
          };

          console.log("[Auth] Syncing user:", {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: profile?.phone_number,
            profileKeys: Object.keys(profile || {}),
          });

          const dbUser = await syncUser(cognitoUser);

          return {
            ...token,
            idToken: account.id_token,
            refreshToken: account.refresh_token,
            expiresAt: (account.expires_at || 0) * 1000,
            userId: dbUser?.id || user.id, // Use DB ID if available
            role: dbUser?.role,
            is_banned: dbUser?.is_banned,
            // Cache user data in token
            name: dbUser?.name || user.name || undefined,
            picture: dbUser?.avatar_url || user.image || undefined,
            phone: dbUser?.phone || undefined,
            emailVerified: dbUser?.email_verified || false,
          };
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // Access token has expired
      // NextAuth with Cognito provider handles refresh automatically if configured correctly,
      // but for now we will just return the token and let session expire if needed.
      // Implementing manual refresh with Cognito requires a different flow.
      return token;
    },
    async session({ session, token }) {
      // Always hydrate user from DB to reflect latest avatar/profile
      if (token.userId) {
        // Optimization: Rely on JWT token data instead of fetching from DB on every request.
        // The JWT is updated on sign-in (via syncUser) and can be refreshed if needed.
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.is_banned = token.is_banned as boolean;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.phone = token.phone as string;
        session.user.emailVerified = token.emailVerified ? new Date() : null;

        /*
        try {
          const { getDb } = await import("@/lib/db");
          const { users } = await import("@/db/schema");
          const { eq } = await import("drizzle-orm");

          const db = await getDb();
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.userId as string),
          });

          if (dbUser) {
            session.user.name = dbUser.name;
            session.user.image = dbUser.avatar_url;
            session.user.phone = dbUser.phone;
            session.user.emailVerified = dbUser.email_verified;
            session.user.is_banned = dbUser.is_banned;
          }
        } catch (error) {
          console.error("Error fetching user in session callback:", error);
        }
        */
      }
      return session;
    },
  },
});
