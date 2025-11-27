# Security Implementation Guide

**Created**: 2025-11-26
**Status**: Phase 0 & 1 Complete - Ready for Application

This guide provides step-by-step instructions for applying the security measures implemented in Phase 0 and Phase 1 to your existing codebase.

---

## ✅ Already Implemented (No Action Required)

### 1. Security Headers
- **Status**: ✅ Active on all routes
- **Location**: [next.config.ts:48-84](next.config.ts#L48-L84)
- **Test**: Run `curl -I http://localhost:3000` to verify
- **Headers Applied**:
  - `X-DNS-Prefetch-Control: on`
  - `Strict-Transport-Security: max-age=63072000`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 2. Debug Logging Protection
- **Status**: ✅ All console.log wrapped in development checks
- **Location**: [src/auth.ts](src/auth.ts)
- **Result**: Production builds will have minimal logging

### 3. Secrets Removed
- **Status**: ✅ All hardcoded secrets removed from .env.example
- **Action Required**: ⚠️ **CRITICAL** - Rotate exposed secrets (see below)

---

## ⚠️ CRITICAL: Immediate Actions Required

### 1. Rotate Exposed Secrets

These secrets were exposed in git history and **MUST** be regenerated:

#### Cloudflare Turnstile Keys
1. Go to: https://dash.cloudflare.com/turnstile
2. Delete the old site (or generate new keys)
3. Create a new Turnstile site
4. Copy the new sitekey and secret key
5. Update your `.env.local`:
   ```bash
   NEXT_PUBLIC_BANDOFBAKERS_TURNSTILE_SITEKEY=your_new_sitekey
   BANDOFBAKERS_TURNSTILE_SECRET_KEY=your_new_secret_key
   ```
6. Update the sitekey in any frontend forms that use Turnstile
7. Test login/registration still works

#### Production Deployment
For Cloudflare Pages deployment, use `wrangler secret put`:
```bash
wrangler secret put BANDOFBAKERS_TURNSTILE_SECRET_KEY
wrangler secret put AUTH_SECRET
wrangler secret put GCP_API_KEY
```

### 2. Configure Cloudflare WAF Rate Limiting

Rate limiting is handled by Cloudflare WAF (not application code).

**Setup Instructions**:
1. Go to Cloudflare Dashboard → Your Domain → Security → WAF
2. Create rate limiting rules:

#### Recommended Rules

**Login Endpoint**:
- **Rule Name**: Login Rate Limit
- **Expression**: `(http.request.uri.path eq "/api/auth/callback/credentials" and http.request.method eq "POST")`
- **Action**: Block
- **Rate**: 5 requests per 15 minutes per IP
- **Duration**: 1 hour

**Registration Endpoint**:
- **Rule Name**: Signup Rate Limit
- **Expression**: `(http.request.uri.path eq "/api/auth/register" and http.request.method eq "POST")`
- **Action**: Block
- **Rate**: 3 requests per hour per IP
- **Duration**: 1 hour

**General API Protection**:
- **Rule Name**: API Rate Limit
- **Expression**: `(http.request.uri.path contains "/api/")`
- **Action**: Challenge
- **Rate**: 100 requests per minute per IP
- **Duration**: 5 minutes

---

## 🔒 Apply Security to Server Actions

You have **2 Server Actions** that need security hardening:

### 1. Profile Update Action

**File**: [src/actions/profile.ts](src/actions/profile.ts)

**Current Issues**:
- ❌ No CSRF protection
- ❌ No input sanitization
- ❌ Console.log in production
- ❌ File upload without validation

**Required Changes**:

```typescript
"use server";

import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import { requireCsrf } from "@/lib/csrf";
import { sanitizeText, sanitizePhone, sanitizeFileName } from "@/lib/sanitize";

export async function updateProfile(formData: FormData) {
  // 1. CSRF Protection
  await requireCsrf();

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const userId = session.user.id;

  // 2. Sanitize Inputs
  const rawName = formData.get("name") as string;
  const rawPhone = formData.get("phone") as string;
  const avatarFile = formData.get("avatar") as File | null;

  // Validate and sanitize
  const name = sanitizeText(rawName);
  const phone = sanitizePhone(rawPhone);

  if (!name || name.length < 2) {
    return { error: "Invalid name" };
  }

  if (phone && !sanitizePhone(phone)) {
    return { error: "Invalid phone number" };
  }

  try {
    const db = await getDb();
    let avatarUrl = undefined;

    // Handle Avatar Upload to R2
    if (avatarFile && avatarFile.size > 0) {
      // 3. File Upload Validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (avatarFile.size > maxSize) {
        return { error: "File too large. Maximum size is 5MB" };
      }

      if (!allowedTypes.includes(avatarFile.type)) {
        return { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" };
      }

      const { env } = await getCloudflareContext();
      const r2 = (env as any).R2;

      if (!r2) {
        if (process.env.NODE_ENV === 'development') {
          console.error("R2 binding is missing in environment");
        }
        return { error: "Storage configuration error" };
      }

      // 4. Sanitize filename
      const fileExt = avatarFile.name.split('.').pop() || 'jpg';
      const safeExt = sanitizeFileName(fileExt);
      const fileName = `images/avatars/${userId}-${Date.now()}.${safeExt}`;

      const fileBuffer = await avatarFile.arrayBuffer();

      await r2.put(fileName, fileBuffer, {
        httpMetadata: {
          contentType: avatarFile.type,
        },
      });

      avatarUrl = `/${fileName}`;

      // 5. Development-only logging
      if (process.env.NODE_ENV === 'development') {
        console.log("Uploaded avatar to R2:", fileName);
      }
    }

    // Update User in DB
    await db
      .update(users)
      .set({
        name,
        phone,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Profile update error:", error);
    }
    return { error: "Failed to update profile" };
  }
}
```

**Changes Summary**:
1. ✅ Added `requireCsrf()` validation
2. ✅ Sanitized name with `sanitizeText()`
3. ✅ Validated phone with `sanitizePhone()`
4. ✅ Added file size limit (5MB)
5. ✅ Added file type validation
6. ✅ Sanitized file extension
7. ✅ Wrapped all console.log in development checks

---

### 2. User Registration Action

**File**: [src/actions/auth.ts](src/actions/auth.ts)

**Current Issues**:
- ❌ No CSRF protection
- ❌ No input sanitization
- ❌ Weak validation

**Required Changes**:

```typescript
"use server";

import { signUpWithEmailAndPassword } from "@/lib/google-identity";
import { syncUser } from "@/lib/auth/sync-user";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { requireCsrf } from "@/lib/csrf";
import { sanitizeText, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";

export async function registerUser(formData: FormData) {
  // 1. CSRF Protection
  await requireCsrf();

  // 2. Sanitize and Validate Inputs
  const rawName = formData.get("name") as string;
  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;
  const rawPhone = formData.get("phone") as string;

  const name = sanitizeText(rawName);
  const email = sanitizeEmail(rawEmail);
  const phone = sanitizePhone(rawPhone);

  // Validate required fields
  if (!name || name.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }

  if (!email) {
    return { error: "Invalid email address" };
  }

  if (!rawPassword || rawPassword.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  // Password strength check
  const hasUpperCase = /[A-Z]/.test(rawPassword);
  const hasLowerCase = /[a-z]/.test(rawPassword);
  const hasNumber = /[0-9]/.test(rawPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { error: "Password must contain uppercase, lowercase, and numbers" };
  }

  if (rawPhone && !phone) {
    return { error: "Invalid phone number" };
  }

  try {
    // 3. Create user in GCP Identity Platform
    const { user } = await signUpWithEmailAndPassword(email, rawPassword, name);

    // 4. Sync user to D1 database
    await syncUser({
      ...user,
      displayName: name,
      photoURL: user.photoURL,
      phone: phone || undefined,
    });

    // 5. Sign the user in immediately
    await signIn("credentials", {
      email,
      password: rawPassword,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.error("Registration error:", error);
    }

    return { error: error instanceof Error ? error.message : "Registration failed" };
  }
}
```

**Changes Summary**:
1. ✅ Added `requireCsrf()` validation
2. ✅ Sanitized name with `sanitizeText()`
3. ✅ Validated email with `sanitizeEmail()`
4. ✅ Validated phone with `sanitizePhone()`
5. ✅ Added password strength requirements
6. ✅ Wrapped console.error in development check

---

## 📋 Future Server Actions Checklist

When creating new Server Actions, **ALWAYS** apply these security measures:

### Required for ALL Server Actions:
```typescript
"use server";

import { requireCsrf } from "@/lib/csrf";
import { sanitizeText, sanitizeHtml, sanitizeEmail } from "@/lib/sanitize";

export async function yourAction(formData: FormData) {
  // 1. CSRF Protection (ALWAYS FIRST)
  await requireCsrf();

  // 2. Authentication check (if required)
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  // 3. Input sanitization
  const cleanInput = sanitizeText(formData.get("input") as string);

  // 4. Validation
  if (!cleanInput || cleanInput.length < 1) {
    return { error: "Invalid input" };
  }

  // 5. Your business logic...
  try {
    // ...
  } catch (error) {
    // 6. Development-only logging
    if (process.env.NODE_ENV === 'development') {
      console.error("Action error:", error);
    }
    return { error: "Action failed" };
  }
}
```

---

## 🎨 Apply Sanitization to Rich Content

### News Posts, Testimonials, Product Descriptions

When users can input rich HTML content (e.g., TinyMCE editor):

```typescript
import { sanitizeHtml } from "@/lib/sanitize";

// For rich content editors
const cleanContent = sanitizeHtml(userInput, 'rich');

// Allowed tags: b, i, em, strong, u, p, br, ul, ol, li, h1-h6, blockquote, a, img, table
```

### User Names, Comments, Short Text

For plain text input:

```typescript
import { sanitizeText } from "@/lib/sanitize";

// Strip all HTML tags
const cleanText = sanitizeText(userInput);
```

### Form Validation Example

```typescript
import { sanitizeText, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";

const name = sanitizeText(formData.get("name") as string);
const email = sanitizeEmail(formData.get("email") as string);
const phone = sanitizePhone(formData.get("phone") as string);

if (!name || name.length < 2) {
  return { error: "Invalid name" };
}

if (!email) {
  return { error: "Invalid email" };
}

if (phone && !sanitizePhone(phone)) {
  return { error: "Invalid phone number" };
}
```

---

## 🧪 Testing Your Security Implementation

### 1. Test Security Headers
```bash
curl -I http://localhost:3000
```

**Expected Output**:
```
X-DNS-Prefetch-Control: on
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 2. Test CSRF Protection

Create a test HTML file outside your app:

```html
<!-- csrf-test.html -->
<!DOCTYPE html>
<html>
<body>
  <form action="http://localhost:3000/api/your-action" method="POST">
    <input type="hidden" name="malicious" value="payload">
    <button type="submit">Submit</button>
  </form>
</body>
</html>
```

Open this file in a browser and submit. The action should **FAIL** with CSRF error.

### 3. Test Input Sanitization

Try submitting malicious HTML:

```html
<script>alert('XSS')</script><img src=x onerror="alert('XSS')">
```

**Expected Result**: HTML should be stripped or escaped, no script execution.

### 4. Test File Upload Validation

Try uploading:
- ❌ File larger than 5MB → Should fail
- ❌ Non-image file (e.g., .exe) → Should fail
- ✅ Valid JPEG/PNG/WebP under 5MB → Should succeed

### 5. Test Rate Limiting (WAF)

After configuring WAF rules:
- Make 6 login attempts in 15 minutes → 6th should be blocked
- Make 4 signup attempts in 1 hour → 4th should be blocked

---

## 📊 Security Checklist

Use this checklist for every new feature:

### Server Actions
- [ ] `await requireCsrf()` added as first line
- [ ] All user input sanitized
- [ ] All inputs validated
- [ ] Authentication checked (if required)
- [ ] File uploads validated (size, type, extension)
- [ ] Console.log wrapped in `process.env.NODE_ENV === 'development'`
- [ ] Error messages don't leak sensitive info

### Forms
- [ ] HTML sanitized with `sanitizeHtml()` or `sanitizeText()`
- [ ] Email validated with `sanitizeEmail()`
- [ ] Phone validated with `sanitizePhone()`
- [ ] URLs validated with `sanitizeUrl()`
- [ ] File names sanitized with `sanitizeFileName()`

### API Routes
- [ ] CSRF validation added (if not using NextAuth)
- [ ] Rate limiting configured in WAF
- [ ] Input sanitization applied
- [ ] Authentication checked

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] ✅ Security headers verified in `next.config.ts`
- [ ] ⚠️ **CRITICAL**: New Turnstile keys generated and deployed
- [ ] ⚠️ **CRITICAL**: All secrets rotated (AUTH_SECRET, GCP_API_KEY)
- [ ] ✅ WAF rate limiting rules configured
- [ ] ✅ CSRF protection applied to all Server Actions
- [ ] ✅ Input sanitization applied to all user inputs
- [ ] ✅ File upload validation implemented
- [ ] ✅ Debug logging wrapped in development checks
- [ ] ✅ Production build tested (`pnpm build`)
- [ ] ✅ Environment variables set via `wrangler secret put`

---

## 📚 Available Utilities

### CSRF Protection
```typescript
import { requireCsrf, validateCsrf, CsrfError } from "@/lib/csrf";
```

### Input Sanitization
```typescript
import {
  sanitizeHtml,      // Clean HTML (basic or rich)
  sanitizeText,      // Strip all HTML
  sanitizeFileName,  // Safe file names
  sanitizeUrl,       // Validate URLs
  sanitizeEmail,     // Validate emails
  sanitizePhone,     // Validate UK phone numbers
} from "@/lib/sanitize";
```

### KV Service (Future Use)
```typescript
import { kvService } from "@/lib/kv";

// Sessions
await kvService.setSession(sessionId, data);
const session = await kvService.getSession(sessionId);

// Cache
await kvService.setCache("key", data, 300);
const cached = await kvService.getCached<Type>("key");

// Tokens
await kvService.setToken("reset", token, userId, 3600);
const userId = await kvService.getToken("reset", token);

// Feature Flags
await kvService.setFeatureFlag("newFeature", true);
const isEnabled = await kvService.getFeatureFlag("newFeature");
```

---

## 🔗 Related Files

- [REFACTOR_PROGRESS.md](REFACTOR_PROGRESS.md) - Track overall refactor progress
- [refactor-plan.md](refactor-plan.md) - Full 6-phase refactor plan
- [next.config.ts](next.config.ts) - Security headers configuration
- [src/lib/csrf.ts](src/lib/csrf.ts) - CSRF protection utilities
- [src/lib/sanitize.ts](src/lib/sanitize.ts) - Input sanitization utilities
- [src/lib/kv/index.ts](src/lib/kv/index.ts) - KV service wrapper

---

**Last Updated**: 2025-11-26
**Phase**: 1 Complete - Ready for Application
**Next Phase**: Phase 2 (Testing Infrastructure)
