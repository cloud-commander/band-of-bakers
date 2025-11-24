# Google Identity Platform Authentication Setup

## Overview

The Band of Bakers application now includes Google Identity Platform authentication with both email/password login and Google OAuth sign-in options.

## Features Implemented

- ✅ Google Identity Platform integration (not Firebase)
- ✅ Email/password authentication via API routes
- ✅ Google OAuth 2.0 social login
- ✅ Session management with secure cookies
- ✅ Authentication context for React components
- ✅ Login and signup forms with proper error handling
- ✅ Security features (CSRF state, token verification)
- ✅ **Zod validation schemas for form validation**

## Google OAuth Button Added

Both the login and signup pages now include a "Sign in with Google" button that uses the official Google branding and OAuth flow.

## Setup Required

To use Google OAuth authentication, you need to configure Google Identity Platform credentials:

### 1. Set Environment Variables

Create a `.env.local` file in the project root with your Google credentials:

```env
# From OAuth 2.0 Client
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_PROJECT_ID=your-gcp-project-id

# From API Key
GCP_IDENTITY_PLATFORM_API_KEY=your-identity-platform-api-key

# Optional: Tenant ID
GCP_IDENTITY_PLATFORM_TENANT_ID=bandofbakers-i0f6c

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Configure Google Cloud Console

Follow the detailed setup guide in `docs/GOOGLE_IDENTITY_PLATFORM_SETUP.md` to:

- Enable Google Identity Platform API
- Create OAuth 2.0 credentials
- Configure authorized domains and redirect URIs
- Set up API key restrictions

### 3. OAuth Redirect URIs

Make sure to add these redirect URIs in your Google OAuth client:

- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

## API Endpoints

- `POST /api/auth` - Email/password authentication
- `GET /api/auth` - Get current user
- `GET /api/auth/callback/google` - OAuth callback handler

## Components Updated

- `src/app/(auth)/auth/login/page.tsx` - Added Google OAuth button + Zod validation
- `src/app/(auth)/auth/signup/page.tsx` - Added Google OAuth button + enhanced form validation + Zod validation
- `src/lib/google-identity.ts` - Google Identity Platform service
- `src/lib/validators/auth.ts` - **Zod validation schemas** for authentication forms
- `src/context/auth-context.tsx` - Authentication context provider

## Enhanced Signup Form

The signup form now includes enhanced validation and fields:

- ✅ **Full Name** (required)
- ✅ **Email** (required)
- ✅ **Phone Number** (now required)
- ✅ **Password** (required, minimum 6 characters)
- ✅ **Confirm Password** (required, with matching validation)
- ✅ **Google OAuth** option with official branding

**Validation Features:**

- Password matching validation
- Password length validation (minimum 6 characters)
- Required field validation for phone number
- Real-time error messaging
- Loading states during form submission

## Security Features

- OAuth state parameter for CSRF protection
- Secure HTTP-only cookies for session management
- Token verification with Google Identity Platform
- Error handling for failed authentication attempts

## Testing

The authentication system is ready to test once Google credentials are configured. Users can:

1. Sign up with email and password
2. Login with existing credentials
3. Use "Sign in with Google" for OAuth authentication

All forms include proper error messaging and loading states.

## Zod Validation Implementation

**Validation Schemas Created:**

- `src/lib/validators/auth.ts` - Centralized Zod schemas for authentication

**Schema Features:**

- **Login Schema**: Email and password validation with type safety
- **Signup Schema**: Name, email, phone, password, and confirm password validation
- **Type Safety**: Full TypeScript type inference from Zod schemas
- **Custom Rules**:
  - UK phone number format validation (e.g., +44 7700 900000)
  - Password confirmation matching
  - Minimum password length (6 characters)
  - Required field validation
- **Error Handling**: Structured error messages from Zod validation
- **Centralized**: All authentication validation in one place for maintainability

**Benefits:**

- Type-safe form validation
- Consistent error handling across forms
- Automatic TypeScript type generation
- Centralized validation rules
- Better developer experience with IDE support
