import NextAuth, { type DefaultSession, AuthError } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { syncUser } from "./lib/auth/sync-user";
import { JWT } from "next-auth/jwt";
import { verifyIdToken } from "./lib/google-identity";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      is_banned?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    idToken?: string;
    refreshToken?: string;
    expiresIn?: string;
    role?: string;
    is_banned?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    tenantId?: string;
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

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.GCP_IDENTITY_PLATFORM_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      idToken: refreshedTokens.id_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fallback to old refresh token
      expiresAt: Date.now() + parseInt(refreshedTokens.expires_in) * 1000,
    };
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error refreshing access token", error);
    }
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        const tenantId = process.env.GCP_IDENTITY_PLATFORM_TENANT_ID;
        const apiKey = process.env.GCP_IDENTITY_PLATFORM_API_KEY;

        if (!apiKey || !tenantId) {
          if (process.env.NODE_ENV === "development") {
            console.error("Missing GCP configuration - check environment variables");
          }
          return null;
        }

        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            tenantId,
            returnSecureToken: true,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Only log in development
          if (process.env.NODE_ENV === "development") {
            console.error("Credentials login failed:", {
              status: response.status,
              code: data?.error?.code,
              message: data?.error?.message,
            });
          }
          return null;
        }

        // Enforce email verification (Google is source of truth)
        const verified = await verifyIdToken(data.idToken);
        if (!verified.emailVerified) {
          if (process.env.NODE_ENV === "development") {
            console.warn("Login blocked: email not verified");
          }
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        // Return an object that looks like a user, but contains the tokens
        // This object will be passed to the `jwt` callback as the `user` argument
        return {
          id: data.localId,
          email: data.email,
          name: data.displayName,
          image: data.profilePicture, // Adjust if GCP returns something else
          idToken: data.idToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT | null> {
      // Initial sign in
      if (account && user) {
        // If provider is Google, exchange token
        if (account.provider === "google") {
          const tenantId = process.env.GCP_IDENTITY_PLATFORM_TENANT_ID;
          const apiKey = process.env.GCP_IDENTITY_PLATFORM_API_KEY;

          // Exchange Google ID Token for Firebase/GCP Token
          const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`;

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postBody: `id_token=${account.id_token}&providerId=google.com`,
              requestUri: "http://localhost", // Placeholder, required by API but often ignored for this flow
              returnIdpCredential: true,
              returnSecureToken: true,
              tenantId: tenantId,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (process.env.NODE_ENV === "development") {
              console.error("Google token exchange error:", data);
            }
            // Return original token on error
            return token;
          }

          // Sync user to D1
          const dbUser = await syncUser(user);

          return {
            ...token,
            idToken: data.idToken,
            refreshToken: data.refreshToken,
            expiresAt: Date.now() + parseInt(data.expiresIn) * 1000,
            tenantId: tenantId,
            userId: dbUser?.id || data.localId, // Use DB ID if available
            role: dbUser?.role,
            is_banned: dbUser?.is_banned,
            // Cache user data in token
            name: dbUser?.name || user.name || undefined,
            picture: dbUser?.avatar_url || user.image || undefined,
            phone: dbUser?.phone || undefined,
            emailVerified: dbUser?.email_verified || false,
          };
        } else if (account.provider === "credentials") {
          // Credentials provider already returns the correct shape in `authorize`
          // But `user` object here comes from `authorize` return

          const dbUser = await syncUser(user);

          return {
            ...token,
            idToken: user.idToken,
            refreshToken: user.refreshToken,
            expiresAt: Date.now() + parseInt(user.expiresIn!) * 1000,
            tenantId: process.env.GCP_IDENTITY_PLATFORM_TENANT_ID,
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

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Always hydrate user from DB to reflect latest avatar/profile
      if (token.idToken && token.userId) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.is_banned = token.is_banned as boolean;

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
            // @ts-expect-error: Custom session property
            session.user.phone = dbUser.phone;
            session.user.emailVerified = dbUser.email_verified;
            session.user.is_banned = dbUser.is_banned;
          } else {
            // Fallback to token cache if DB user not found
            if (token.name) {
              session.user.name = token.name as string;
              session.user.image = token.picture as string;
              // @ts-expect-error: Custom session property
              session.user.phone = token.phone as string;
              // @ts-expect-error: Custom session property
              session.user.emailVerified = token.emailVerified as boolean;
            }
          }
        } catch (error) {
          console.error("Error fetching user in session callback:", error);
          // Fallback to token cache
          if (token.name) {
            session.user.name = token.name as string;
            session.user.image = token.picture as string;
            // @ts-expect-error: Custom session property
            session.user.phone = token.phone as string;
            // @ts-expect-error: Custom session property
            session.user.emailVerified = token.emailVerified as boolean;
          }
        }
      }
      return session;
    },
  },
});
