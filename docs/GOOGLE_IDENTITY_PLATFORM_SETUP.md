# Google Identity Platform Authentication Setup

This guide explains how to set up Google Identity Platform for the Band of Bakers application.

## Prerequisites

- Google Cloud Platform (GCP) account
- GCP project created
- Billing enabled (required for Identity Platform)

## Setup Steps

### 1. Enable Google Identity Platform

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services > Library**
4. Search for "Identity Platform"
5. Click **Enable** on "Identity Platform API"

### 2. Configure Authentication Providers

#### Email/Password Provider

1. Go to **Identity Platform > Providers**
2. Click **Add a provider**
3. Select **Email/Password**
4. Enable **Email/Password** sign-in
5. (Optional) Enable **Email link** (passwordless) sign-in
6. Click **Save**

#### Google OAuth Provider

1. In **Identity Platform > Providers**
2. Click **Add a provider**
3. Select **Google**
4. Enter your OAuth client ID and secret (see next section)
5. Click **Save**

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: Band of Bakers Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (development)
     - `https://bandofbakers.co.uk` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://bandofbakers.co.uk/api/auth/callback/google` (production)
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 4. Create API Key

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy the API key
4. (Recommended) Click **Restrict Key**:
   - **Application restrictions**: HTTP referrers
   - Add your domains:
     - `localhost:3000/*`
     - `bandofbakers.co.uk/*`
   - **API restrictions**: Restrict to "Identity Toolkit API"
5. Click **Save**

### 5. Configure Tenant (Optional)

If you want to use multi-tenancy:

1. Go to **Identity Platform > Tenants**
2. Click **Add tenant**
3. Configure tenant settings
4. Copy the **Tenant ID** (e.g., `bandofbakers-i0f6c`)

### 6. Set Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# From OAuth 2.0 Client
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-here
GOOGLE_PROJECT_ID=your-project-id

# From API Key
GCP_IDENTITY_PLATFORM_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Optional: Tenant ID
GCP_IDENTITY_PLATFORM_TENANT_ID=bandofbakers-i0f6c
```

### 7. Configure Cloudflare Secrets (Production)

When deploying to Cloudflare Pages:

```bash
# Set secrets via Wrangler CLI
npx wrangler pages secret put GOOGLE_CLIENT_SECRET
npx wrangler pages secret put GCP_IDENTITY_PLATFORM_API_KEY

# Or via Cloudflare Dashboard:
# Pages > Your Project > Settings > Environment Variables
```

**Public variables** (add to `wrangler.toml` or Cloudflare Dashboard):

```toml
[env.production.vars]
NEXT_PUBLIC_GOOGLE_CLIENT_ID = "your-client-id"
GOOGLE_PROJECT_ID = "your-project-id"
GCP_IDENTITY_PLATFORM_TENANT_ID = "bandofbakers-i0f6c"
NEXT_PUBLIC_APP_URL = "https://bandofbakers.co.uk"
```

## Security Best Practices

### API Key Restrictions

1. **Application restrictions**: Limit to your domains
2. **API restrictions**: Only enable Identity Toolkit API
3. **Regenerate regularly**: Rotate keys every 90 days

### OAuth Client Security

1. **Authorized domains**: Only add domains you control
2. **Redirect URIs**: Use exact URLs, no wildcards
3. **Client secret**: Never expose in client-side code

### Environment Variables

1. **Never commit** `.env.local` to version control
2. **Use Cloudflare Secrets** for sensitive values in production
3. **Prefix public vars** with `NEXT_PUBLIC_` only when needed in browser

### Password Security

**Client-Side Hashing:**

- All passwords are hashed using **Web Crypto API** (PBKDF2 with SHA-256)
- 100,000 iterations (OWASP recommended minimum)
- Cryptographically secure random salts (16 bytes)
- Constant-time comparison to prevent timing attacks

**Implementation:**

```typescript
import { hashPassword, verifyPassword } from "@/lib/crypto";

// Hash password before sending to Google Identity Platform
const { hash, salt } = await hashPassword(password);

// Verify password
const isValid = await verifyPassword(password, storedHash, storedSalt);
```

**Why Web Crypto API?**

- Native browser and Node.js support (no dependencies)
- Hardware-accelerated when available
- Cryptographically secure random number generation
- FIPS 140-2 compliant implementations
- Prevents common crypto mistakes

**Additional Security Features:**

- Secure token generation for sessions and CSRF
- AES-GCM encryption for sensitive data
- SHA-256 hashing for fingerprints and checksums
- UUID v4 generation for unique identifiers

See `src/lib/crypto.ts` for full implementation.

## Testing Authentication

### Local Development

1. Start the dev server:

   ```bash
   pnpm run dev
   ```

2. Navigate to `http://localhost:3000/auth/login`

3. Test email/password signup:

   - Create a new account
   - Verify email (if enabled)
   - Login with credentials

4. Test Google OAuth:
   - Click "Sign in with Google"
   - Authorize the application
   - Verify successful login

### Verify in GCP Console

1. Go to **Identity Platform > Users**
2. You should see your test users listed
3. Check user metadata and sign-in methods

## Troubleshooting

### "API key not valid" Error

- Verify API key is correct in `.env.local`
- Check API restrictions allow Identity Toolkit API
- Ensure HTTP referrer restrictions include your domain

### OAuth Redirect URI Mismatch

- Verify redirect URI in OAuth client matches exactly
- Check for trailing slashes
- Ensure protocol (http/https) matches

### Tenant Not Found

- Verify `GCP_IDENTITY_PLATFORM_TENANT_ID` is correct
- Check tenant is enabled in GCP Console
- Try without tenant ID first (use default tenant)

## Resources

- [Google Identity Platform Documentation](https://cloud.google.com/identity-platform/docs)
- [Identity Platform REST API](https://cloud.google.com/identity-platform/docs/reference/rest)
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

## Next Steps

After authentication is configured:

1. Implement authentication middleware
2. Create protected API routes
3. Add role-based access control
4. Set up session management
5. Implement password reset flow
6. Add email verification
