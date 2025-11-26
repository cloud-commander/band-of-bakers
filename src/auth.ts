import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { syncUser } from "./lib/auth/sync-user";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    idToken?: string;
    refreshToken?: string;
    expiresIn?: string;
    role?: string;
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
    async jwt({ token, user, account }) {
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
      // Pass properties to the client
      if (token.idToken && token.userId) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;

        // Fetch latest user data from DB to ensure updates (avatar, name, etc.) are reflected
        try {
          // We need to dynamically import getDb to avoid circular dependencies or context issues
          // if auth.ts is used in places where getDb might not be ready.
          // However, standard import should be fine if structured correctly.
          // Let's use the imported getDb.
          const { getDb } = await import("@/lib/db");
          const { users } = await import("@/db/schema");
          const { eq } = await import("drizzle-orm");

          const db = await getDb();
          let dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.userId as string),
          });

          // Fallback: If user not found by ID (e.g. token has GCP ID but DB has UUID), try email
          if (!dbUser && session.user.email) {
            console.log("User not found by ID, trying email:", session.user.email);
            dbUser = await db.query.users.findFirst({
              where: eq(users.email, session.user.email),
            });
          }

          console.log(
            "Session callback - Fetched user:",
            dbUser ? { id: dbUser.id, name: dbUser.name } : "Not found"
          );

          if (dbUser) {
            session.user.id = dbUser.id; // Ensure session has the correct DB ID
            session.user.name = dbUser.name;
            session.user.image = dbUser.avatar_url;
            session.user.role = dbUser.role;
            // @ts-expect-error: Custom session property
            session.user.phone = dbUser.phone;
            // @ts-expect-error: Custom session property
            session.user.emailVerified = dbUser.email_verified;
          }
        } catch (error) {
          console.error("Error fetching user in session callback:", error);
        }
      }
      return session;
    },
  },
});
