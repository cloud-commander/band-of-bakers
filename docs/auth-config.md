# NextAuth.js + AWS Cognito Configuration Guide

## Overview

This document describes the complete configuration needed to integrate NextAuth.js with AWS Cognito in a Next.js application deployed on Cloudflare Workers. The setup supports multiple environments (development, staging, production) with environment-aware authentication flows.

## Architecture

```
User Browser
    ↓
Next.js App (Cloudflare Workers)
    ↓
NextAuth.js (handles OAuth flow)
    ↓
AWS Cognito (OAuth 2.0 provider)
    ↓
D1 Database (user sync)
```

## Key Configuration Files

### 1. **src/auth.ts** - Main NextAuth Configuration

The core authentication setup with Cognito provider:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Trust host header for callback URL detection in Cloudflare Workers
  // This allows the auth flow to work correctly across different environments
  // (localhost, staging, production) without requiring explicit NEXTAUTH_URL
  trustHost: true,
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
  // Callbacks for JWT and session management
  callbacks: {
    async jwt({ token, user, account, profile }): Promise<JWT> {
      // Handle initial sign-in
      if (account && user) {
        const { syncUser } = await import("./lib/auth/sync-user");
        const dbUser = await syncUser({
          ...user,
          emailVerified: profile?.email_verified as boolean,
          phone: (profile?.phone_number as string) || undefined,
        });

        return {
          ...token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          expiresAt: (account.expires_at || 0) * 1000,
          userId: dbUser?.id || user.id,
          role: dbUser?.role,
          is_banned: dbUser?.is_banned,
        };
      }

      // Return token if access token hasn't expired
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      return token;
    },

    async session({ session, token }) {
      // Hydrate session with token data and optional DB sync
      if (token.userId) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.is_banned = token.is_banned as boolean;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.phone = token.phone as string;
        session.user.emailVerified = token.emailVerified ? new Date() : null;

        // Optional: Fetch latest user data from DB
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
          }
        } catch (error) {
          console.error("Error fetching user in session callback:", error);
        }
      }
      return session;
    },
  },
});
```

**Key Features:**

- **`trustHost: true`** - Detects the correct host from request headers, enabling environment-aware callback URLs without hardcoding
- **Cognito Provider** - Uses public client (PKCE flow) with `none` token endpoint auth
- **JWT Callback** - Syncs Cognito user data to D1 database on first login
- **Session Callback** - Enriches session with user role, phone, and avatar data

### 2. **src/auth.config.ts** - NextAuth Middleware Configuration

Handles authorization logic at the middleware level:

```typescript
export const authConfig = {
  pages: {
    // Removed custom signin page to use Cognito Hosted UI
    // signIn: "/auth/login", // Handled by /auth/login client page instead
  },
  callbacks: {
    async session({ session, token }) {
      // Map JWT role to session
      if (token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      // Block banned users
      if (isLoggedIn) {
        const user = auth.user as { role?: string; is_banned?: boolean };
        if (user.is_banned) {
          return false;
        }
      }

      // Protect /admin routes
      if (isOnAdmin) {
        if (isLoggedIn) {
          const user = auth.user as { role?: string };
          const allowedRoles = ["owner", "manager", "staff"];
          if (user.role && allowedRoles.includes(user.role)) {
            return true;
          }
          return Response.redirect(new URL("/", nextUrl));
        }
        return false;
      }

      // Redirect logged-in users away from auth pages
      if (isOnAuth) {
        if (isLoggedIn) {
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
  providers: [],
} satisfies NextAuthConfig;
```

**Key Features:**

- **Role-based access control** - Restricts `/admin` routes to owners, managers, and staff
- **Ban system** - Immediately logs out banned users
- **Auth page redirect** - Prevents logged-in users from accessing `/auth/*` pages

### 3. **src/app/api/auth/[...nextauth]/route.ts** - NextAuth API Routes

Exposes NextAuth handlers as API routes:

```typescript
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

This creates the OAuth callback endpoint at `/api/auth/callback/cognito`.

### 4. **src/app/(auth)/auth/login/page.tsx** - Login Page

Server component that redirects to a Route Handler for authentication:

```typescript
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";

  // If already logged in, redirect to callback URL
  if (session?.user) {
    redirect(callbackUrl);
  }

  // Redirect to route handler that will initiate Cognito OAuth flow
  redirect(`/api/auth/signin-cognito?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}
```

**Key Features:**

- **Server Component** - Uses Next.js 15 async Server Components
- **Session Check** - Redirects already logged-in users to their intended destination
- **Route Handler Redirect** - Delegates to `/api/auth/signin-cognito` which can modify cookies
- **callbackUrl support** - Preserves intended destination through the auth flow

**Important:** In Next.js 15, Server Components cannot modify cookies directly. The `signIn()` function from NextAuth requires cookie modification, so we redirect to a Route Handler instead.

### 5. **src/app/api/auth/signin-cognito/route.ts** - Sign In Route Handler

Route Handler that initiates Cognito OAuth flow:

```typescript
import { signIn } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Use NextAuth signIn action to redirect to Cognito Hosted UI
  await signIn("cognito", {
    redirectTo: callbackUrl,
  });
}
```

**Key Features:**

- **Route Handler** - Can modify cookies (required for OAuth flow)
- **Query Parameters** - Accepts `callbackUrl` and optional `screen_hint` for signup
- **Redirect to Cognito** - Initiates OAuth flow with Cognito Hosted UI

### 6. **src/app/api/auth/signout-cognito/route.ts** - Sign Out Route Handler

Route Handler that properly logs out from both NextAuth and Cognito:

```typescript
import { signOut } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // First, sign out from NextAuth
  await signOut({ redirect: false });

  // Get Cognito configuration
  const cognitoIssuer = process.env.AUTH_COGNITO_ISSUER;
  const clientId = process.env.AUTH_COGNITO_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  if (!cognitoIssuer || !clientId) {
    return NextResponse.redirect(new URL(callbackUrl, baseUrl));
  }

  // Extract region and user pool ID from issuer URL
  // Format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
  const issuerMatch = cognitoIssuer.match(/https:\/\/cognito-idp\.([^.]+)\.amazonaws\.com\/([^/]+)/);

  if (!issuerMatch) {
    return NextResponse.redirect(new URL(callbackUrl, baseUrl));
  }

  const region = issuerMatch[1];
  const userPoolId = issuerMatch[2];

  // Construct Cognito logout URL
  const cognitoDomain = `https://${userPoolId}.auth.${region}.amazoncognito.com`;
  const logoutUrl = new URL(`${cognitoDomain}/logout`);
  logoutUrl.searchParams.set("client_id", clientId);
  logoutUrl.searchParams.set("logout_uri", `${baseUrl}${callbackUrl}`);

  // Redirect to Cognito logout endpoint
  return NextResponse.redirect(logoutUrl.toString());
}
```

**Key Features:**

- **Two-Step Logout** - Clears both NextAuth session and Cognito session
- **Cognito Logout URL** - Constructs logout URL from issuer and client ID
- **Callback URL** - Returns user to specified page after logout
- **Fallback** - Gracefully handles missing Cognito configuration

**Why This Is Needed:**

Without logging out from Cognito, the Cognito session remains active. When the user tries to login again, Cognito automatically logs them back in without prompting for credentials, making logout ineffective.

### 5. **wrangler.jsonc** - Environment Variables

Cloudflare Workers configuration with environment-aware URLs:

```jsonc
{
  "env": {
    "preview": {
      "name": "bandofbakers-v2-staging",
      "vars": {
        "NEXT_PUBLIC_BASE_URL": "https://staging.bandofbakers.co.uk",
      },
    },
    "production": {
      "name": "bandofbakers-v2-production",
      "vars": {
        "NEXT_PUBLIC_BASE_URL": "https://bandofbakers.co.uk",
      },
    },
  },
}
```

## Environment Variables Required

Set these in AWS Secrets Manager or your CI/CD environment:

```bash
# Cognito Configuration
AUTH_COGNITO_ID=<your-cognito-app-client-id>
AUTH_COGNITO_ISSUER=https://cognito-idp.<region>.amazonaws.com/<user-pool-id>

# NextAuth Secret (for JWT signing)
AUTH_SECRET=<generate-with-openssl-rand-hex-32>

# Database URLs (optional for sync)
DATABASE_URL=file:./local.db  # Development
DATABASE_URL_STAGING=...       # Staging (for migrations)
DATABASE_URL_PROD=...          # Production (for migrations)
```

### Generating AUTH_SECRET

```bash
openssl rand -hex 32
```

## AWS Cognito Setup

### 1. Create User Pool

In AWS Cognito console:

1. Create new user pool (or use existing)
2. Note the **User Pool ID** and **AWS Region**

### 2. Create App Client

1. Navigate to App clients and authentication → App clients
2. Create new app client with these settings:

**Authentication flows:**

- ✅ ALLOW_USER_PASSWORD_AUTH
- ✅ ALLOW_REFRESH_TOKEN_AUTH
- ✅ ALLOW_CUSTOM_AUTH

**App client settings:**

- **Callback URL(s):**

  ```
  http://localhost:3000/api/auth/callback/cognito
  http://localhost:8788/api/auth/callback/cognito
  https://staging.bandofbakers.co.uk/api/auth/callback/cognito
  https://bandofbakers.co.uk/api/auth/callback/cognito
  ```

- **Sign out URL(s):** (Required for proper logout flow)

  ```
  http://localhost:3000/
  http://localhost:8788/
  https://staging.bandofbakers.co.uk/
  https://bandofbakers.co.uk/
  ```

  **Important:** The trailing slash is required! Cognito logout redirects to `logout_uri` parameter, which our `/api/auth/signout-cognito` handler provides.

- **Allowed OAuth Scopes:** openid, profile, email
- **Token Endpoint Authentication:** None

3. Note the **App Client ID** (use as `AUTH_COGNITO_ID`)

### 3. Get Issuer URL

The issuer URL format:

```
https://cognito-idp.<region>.amazonaws.com/<user-pool-id>
```

Example:

```
https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_abc123xyz
```

## How the Multi-Environment Flow Works

### Development (localhost:3000)

1. User clicks "Login" → redirected to `/auth/login`
2. Page calls `signIn("cognito")` with no explicit callback URL
3. `trustHost: true` detects Host header as `localhost:3000`
4. NextAuth redirects to: `https://cognito-idp.../oauth2/authorize?redirect_uri=http://localhost:3000/api/auth/callback/cognito`
5. User authenticates with Cognito
6. Cognito redirects back to `http://localhost:3000/api/auth/callback/cognito`
7. NextAuth verifies code, exchanges for tokens, syncs user to DB

### Staging (staging.bandofbakers.co.uk)

Same flow, but:

- `trustHost: true` detects Host header as `staging.bandofbakers.co.uk`
- Callback URL becomes: `https://staging.bandofbakers.co.uk/api/auth/callback/cognito`
- Must match one of the Cognito app client's Callback URLs

### Production (bandofbakers.co.uk)

Same flow, but with production domain.

**No code changes needed!** The `trustHost: true` setting handles environment detection automatically via HTTP Host headers.

## Common Issues & Solutions

### Issue: "Cookies can only be modified in a Server Action or Route Handler"

**Problem:** Mobile login fails with error: "Cookies can only be modified in a Server Action or Route Handler"

**Cause:** In Next.js 15, Server Components cannot modify cookies. The `signIn()` function needs to set cookies for the OAuth state.

**Solution:**

1. Create a Route Handler at `/api/auth/signin-cognito/route.ts` that calls `signIn()`
2. Make the login page redirect to this Route Handler instead of calling `signIn()` directly
3. Example:

```typescript
// Login page - Server Component
export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";
  redirect(`/api/auth/signin-cognito?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}

// Route Handler - Can modify cookies
export async function GET(request: NextRequest) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/";
  await signIn("cognito", { redirectTo: callbackUrl });
}
```

### Issue: Mobile 404 error on auth pages

**Problem:** Auth pages work on desktop but show 404 on mobile

**Cause:** In Next.js 15, `useSearchParams()` requires a Suspense boundary, but this was only failing on some devices/browsers

**Solution (Original):**

Wrap components using `useSearchParams()` in a Suspense boundary:

```typescript
<Suspense fallback={<div>Loading...</div>}>
  <LoginContent />
</Suspense>
```

**Solution (Better):**

Use Server Components with async `searchParams` instead:

```typescript
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams; // No Suspense needed!
  const callbackUrl = params.callbackUrl || "/";
  // ...
}
```

### Issue: Logout doesn't work - auto-logs back in

**Problem:** After clicking logout, user is immediately logged back in without entering credentials

**Cause:** Only the NextAuth session is cleared, but the Cognito session remains active. When redirecting to login, Cognito sees the active session and automatically re-authenticates.

**Solution:**

1. Create a custom logout Route Handler at `/api/auth/signout-cognito/route.ts`
2. First call `signOut({ redirect: false })` to clear NextAuth session
3. Then redirect to Cognito's logout endpoint: `https://{userPoolId}.auth.{region}.amazoncognito.com/logout`
4. Include `client_id` and `logout_uri` parameters
5. Update logout buttons to use `/api/auth/signout-cognito` instead of calling `signOut()` directly

**Example logout flow:**

```typescript
// User clicks logout
window.location.href = "/api/auth/signout-cognito?callbackUrl=/";

// Route Handler
export async function GET(request: NextRequest) {
  await signOut({ redirect: false }); // Clear NextAuth

  // Construct Cognito logout URL
  const logoutUrl = `https://${userPoolId}.auth.${region}.amazoncognito.com/logout?client_id=${clientId}&logout_uri=${baseUrl}/`;

  return NextResponse.redirect(logoutUrl); // Clear Cognito session
}
```

### Issue: Redirect to localhost on staging

**Problem:** Even on staging, user gets redirected to `localhost:3000`

**Cause:** Missing `trustHost: true` or incorrect Host header detection

**Solution:**

1. Verify `trustHost: true` is set in `src/auth.ts`
2. Check that the staging domain is in Cognito's Callback URL list
3. Verify X-Forwarded-Host header is being passed by Cloudflare (should be automatic)

### Issue: "Invalid redirect_uri" from Cognito

**Problem:** Cognito rejects the callback URL

**Cause:** Callback URL in Cognito doesn't match the request domain

**Solution:**

1. Add all environment callback URLs to Cognito app client settings
2. Format must be exact: `https://domain/api/auth/callback/cognito`
3. Note: `http://` (not `https://`) is required for localhost development

### Issue: User not syncing to database

**Problem:** `syncUser` in JWT callback fails silently

**Solution:**

1. Check D1 database connection in production
2. Verify `src/lib/auth/sync-user.ts` is handling Cognito profile correctly
3. Add logging in JWT callback to debug

### Issue: "NEXTAUTH_URL is not set" error

**Problem:** NextAuth requires explicit URL config

**Solution:**

- **Don't set NEXTAUTH_URL** - Let `trustHost: true` handle it
- This is the entire point of using `trustHost: true` on Cloudflare Workers

## Testing the Flow

### Local Development

```bash
pnpm dev
# Navigate to http://localhost:3000
# Click Login
# Should redirect to Cognito Hosted UI
# After auth, should return to http://localhost:3000/api/auth/callback/cognito
```

### Staging

```bash
# Deploy: pnpm deploy:staging
# Visit: https://staging.bandofbakers.co.uk
# Click Login
# Should redirect to Cognito Hosted UI with staging domain
# Should return to https://staging.bandofbakers.co.uk/api/auth/callback/cognito
```

### Verify User Sync

```bash
# Query D1 database
wrangler d1 execute bandofbakers-db-staging --remote --command "SELECT * FROM users WHERE email = 'test@example.com';"
```

## Security Considerations

1. **AUTH_SECRET** - Must be cryptographically secure, 32+ bytes
2. **PKCE Flow** - Automatically used for public clients (PKCE not vulnerable to replay attacks)
3. **JWT Verification** - NextAuth verifies Cognito's JWT signature using issuer's public keys
4. **Session Expiry** - Access tokens expire in 1 hour by default, refresh tokens last longer
5. **HTTPS Required** - Production must use HTTPS; Cognito rejects http:// redirects except localhost

## Type Definitions

TypeScript types are extended in `src/auth.ts`:

```typescript
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
    phone?: string;
    emailVerified?: boolean;
  }
}
```

## Related Files

- **User sync logic:** `src/lib/auth/sync-user.ts`
- **Database schema:** `src/db/schema.ts` (users table)
- **Login button:** `src/components/navbar/user-menu.tsx`
- **Protected routes:** `src/auth.config.ts` → `authorized` callback
- **Auth middleware:** `src/middleware.ts` (uses `auth` from `src/auth.ts`)

## References

- [NextAuth.js Docs](https://next-auth.js.org/)
- [NextAuth + Cognito Provider](https://next-auth.js.org/providers/cognito)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [trustHost Documentation](https://next-auth.js.org/getting-started/example#environment-variables)
