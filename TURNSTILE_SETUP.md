# Cloudflare Turnstile Integration Guide

## Overview

Cloudflare Turnstile has been integrated into your Band of Bakers application to prevent abuse on form submissions, including review submissions and other user input forms.

## What is Turnstile?

Turnstile is Cloudflare's modern replacement for CAPTCHA. It:

- Works invisibly by default (no user interaction required for legitimate users)
- Falls back to visual challenges only when needed
- Protects against bots and abuse
- Is GDPR compliant and privacy-focused
- Doesn't require JavaScript from users

## Setup

### 1. Get Turnstile Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** in the left sidebar
3. Click **Create Site**
4. Enter your domain (e.g., `bandofbakers.co.uk`)
5. Select widget mode: **Invisible** (recommended for best UX)
6. You'll receive:
   - **Site Key** (public, can expose in frontend)
   - **Secret Key** (private, keep secure in backend)

### 2. Add Environment Variables

Update your `.env.local` file:

```env
# Turnstile Widget (Public - used in browser)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY=your_site_key_here

# Turnstile Secret (Private - server-side verification only)
CLOUDFLARE_TURNSTILE_SECRET_KEY=your_secret_key_here
```

## How It Works

### 1. Widget Component

The `TurnstileWidget` component renders the Turnstile widget:

```typescript
// src/components/turnstile/turnstile-widget.tsx
import { TurnstileWidget } from "@/components/turnstile/turnstile-widget";

<TurnstileWidget
  onSuccess={(token) => setToken(token)}
  onError={() => console.error("Widget error")}
  onExpire={() => console.error("Token expired")}
  theme="light"
  size="normal"
/>;
```

**Props:**

- `onSuccess` - Called when user passes verification, receives token
- `onError` - Called if widget fails to load
- `onExpire` - Called if token expires
- `theme` - "light" or "dark"
- `size` - "normal" or "compact"

### 2. Server-Side Verification

The `verifyTurnstileToken` server action validates tokens:

```typescript
// src/lib/actions/verify-turnstile.ts
import { verifyTurnstileToken } from "@/lib/actions/verify-turnstile";

const result = await verifyTurnstileToken(token);
if (result.success) {
  // Token is valid, process form
} else {
  // Token invalid or expired
  console.error(result.error);
}
```

## Current Implementation

### Review Form Protection

The review submission form (`WriteReviewDialog`) now includes Turnstile:

```tsx
// src/components/reviews/write-review-dialog.tsx
<TurnstileWidget
  onSuccess={(token) => setTurnstileToken(token)}
  onError={() => setTurnstileToken(null)}
  onExpire={() => setTurnstileToken(null)}
/>;

// On form submit, verify token
const verification = await verifyTurnstileToken(turnstileToken);
if (!verification.success) {
  toast.error("Verification failed");
  return;
}
```

## Adding Turnstile to Other Forms

To protect additional forms:

### 1. Import the components

```typescript
import { TurnstileWidget } from "@/components/turnstile/turnstile-widget";
import { verifyTurnstileToken } from "@/lib/actions/verify-turnstile";
```

### 2. Add state for the token

```typescript
const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
```

### 3. Add the widget to your form

```tsx
<TurnstileWidget
  onSuccess={(token) => setTurnstileToken(token)}
  onError={() => setTurnstileToken(null)}
  onExpire={() => setTurnstileToken(null)}
/>
```

### 4. Verify on form submission

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (turnstileToken) {
    const verification = await verifyTurnstileToken(turnstileToken);
    if (!verification.success) {
      toast.error("Verification failed");
      return;
    }
  }

  // Process form...
};
```

## Forms to Consider Protecting

1. ✅ **Review Submission** - Already protected
2. **Contact Form** - If you have one
3. **Newsletter Signup** - Optional
4. **Order Comments** - Optional
5. **Product Q&A** - If implemented

## Testing

### Development Mode

In development, if `CLOUDFLARE_TURNSTILE_SECRET_KEY` is not set:

- Widget still appears (with test credentials if available)
- Verification always succeeds
- No actual bot prevention, but UI works

### Production Mode

In production with proper credentials:

- Widget verifies all submissions against Cloudflare servers
- Bots are blocked
- Legitimate users pass invisibly or with minimal challenge

### Test Credentials (Optional)

Cloudflare provides test keys for development:

- **Always passes:** `1x00000000000000000000AA`
- **Always fails:** `2x00000000000000000000AB`
- **Challenge required:** `3x00000000000000000000FF`

## Configuration Options

### Widget Appearance

```typescript
<TurnstileWidget
  theme="dark"        // "light" or "dark"
  size="compact"      // "normal" or "compact"
  onSuccess={...}
/>
```

### Verification Settings

To modify verification behavior, edit `/src/lib/actions/verify-turnstile.ts`:

```typescript
export async function verifyTurnstileToken(token: string) {
  // Options:
  // - Adjust timeout
  // - Add logging
  // - Handle specific error codes
}
```

## Turnstile Error Codes

If verification fails, check `error_codes`:

| Code                     | Meaning                       |
| ------------------------ | ----------------------------- |
| `missing-input-secret`   | Secret key not provided       |
| `invalid-input-secret`   | Secret key is invalid         |
| `missing-input-response` | Response token not provided   |
| `invalid-input-response` | Response token is invalid     |
| `invalid-widget-id`      | Widget ID incorrect           |
| `invalid-parsed-json`    | JSON parsing error            |
| `bad-request`            | Request malformed             |
| `timeout-or-duplicate`   | Token timeout or already used |
| `internal-error`         | Cloudflare server error       |

## Performance Impact

- **Widget Load:** ~50KB additional JavaScript
- **Verification Latency:** ~100-500ms per request
- **User Experience:** Invisible for legitimate users
- **No impact** on page with widget not displayed

## Security Best Practices

1. ✅ **Always verify on server** - Never trust client-side verification
2. ✅ **Store secret key securely** - Use `.env.local` (never commit)
3. ✅ **Check result.success** - Don't just check for token presence
4. ✅ **Rate limit endpoints** - Additional layer of protection
5. ✅ **Log verification failures** - Monitor for attack patterns

## Troubleshooting

### Widget Not Appearing

**Check:**

- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY` is set
- Sitekey is correct format
- Browser console for errors

### Verification Always Fails

**Check:**

- `CLOUDFLARE_TURNSTILE_SECRET_KEY` is set correctly
- Server can reach `challenges.cloudflare.com`
- Token isn't expired (5 minutes max)

### "Widget loading" message appears indefinitely

**Check:**

- Sitekey matches your domain
- No Content Security Policy blocking Cloudflare scripts
- Temporary Cloudflare service issue

### Too many verification failures

**Check:**

- Are users getting blocked legitimately?
- Check Turnstile analytics in Cloudflare Dashboard
- Adjust widget sensitivity if needed

## Monitoring & Analytics

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile**
3. Select your site
4. View:
   - Pass/fail rates
   - Challenge rates
   - Error statistics
   - Human vs bot metrics

## Disabling Turnstile (if needed)

**Temporary disable:**

```env
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY=
```

**Conditional disable (per-form):**

```typescript
if (!process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY) {
  // Skip widget and verification
  return;
}
```

## API Reference

### TurnstileWidget Component

```typescript
interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
}
```

### verifyTurnstileToken Server Action

```typescript
type VerifyResult = {
  success: boolean;
  error?: string;
};

async function verifyTurnstileToken(token: string): Promise<VerifyResult>;
```

## Next Steps

1. **Get Credentials** - Create Turnstile site in Cloudflare Dashboard
2. **Set Env Variables** - Add to `.env.local`
3. **Test Review Form** - Submit a review and verify it's protected
4. **Monitor Analytics** - Check Turnstile dashboard for stats
5. **Expand Usage** - Add to other forms as needed
6. **Adjust Settings** - Tune sensitivity based on user feedback

## Resources

- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)
- [react-turnstile Package](https://github.com/marsidev/react-turnstile)
- [Visibility & Privacy](https://www.cloudflare.com/en-gb/turnstile/)

## Questions?

For issues or questions:

1. Check Turnstile documentation
2. Review error codes in Cloudflare Dashboard
3. Check browser console for client-side errors
4. Review server logs for verification errors
