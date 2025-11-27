# Analytics Setup Guide

This guide will help you complete the analytics configuration for Band of Bakers.

---

## ✅ What's Already Configured

### Logflare Client-Side Tracking
I've added the client-side Logflare configuration to your `.env.local`:

```bash
NEXT_PUBLIC_LOGFLARE_API_KEY=YKyrP1S-ey4h
NEXT_PUBLIC_LOGFLARE_SOURCE_ID=e8d5ad5d-6d9d-45cc-9c34-1f2e7cc21db1
NEXT_PUBLIC_LOGFLARE_DEBUG=false
```

**Status**: ✅ Ready to use (using same source as server-side)

---

## 📋 Action Required: Google Analytics Setup

### Step 1: Get Your Google Analytics Measurement ID

1. **Go to Google Analytics**: https://analytics.google.com

2. **Sign in** with your Google account

3. **Create a Property** (if you haven't already):
   - Click **Admin** (bottom left)
   - Under **Property**, click **Create Property**
   - Name: "Band of Bakers"
   - Timezone: UK
   - Currency: GBP

4. **Create a Data Stream**:
   - Click **Data Streams**
   - Click **Add stream** → **Web**
   - Website URL: `https://bandofbakers.co.uk`
   - Stream name: "Band of Bakers Production"
   - Click **Create stream**

5. **Copy the Measurement ID**:
   - You'll see a **Measurement ID** at the top (format: `G-XXXXXXXXXX`)
   - Copy this ID

### Step 2: Update Your .env.local

Replace the placeholder in your `.env.local`:

```bash
# Before
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# After (example)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-ABC1234567
```

### Step 3: Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
pnpm dev
```

---

## 🧪 Testing Your Analytics Setup

### Test Logflare Client-Side Tracking

1. **Open your browser** to `http://localhost:3000`
2. **Open Developer Console** (F12)
3. **Check for Logflare logs**:
   ```
   [Logflare] Event logged: page_view
   ```
4. **Navigate to a few pages** - each should log a page view
5. **Check Logflare Dashboard**: https://logflare.app
   - You should see page views appearing in real-time

### Test Google Analytics

1. **Open your site** in the browser
2. **Install Google Analytics Debugger** (Chrome extension - optional but helpful):
   - https://chrome.google.com/webstore/detail/google-analytics-debugger
3. **Check Real-Time Reports**:
   - Go to Google Analytics → Reports → Realtime
   - You should see yourself as an active user
4. **Navigate between pages** - watch the realtime report update

### Test Web Vitals

1. **Open Developer Console** (F12)
2. **Navigate your site** (click around, scroll, interact)
3. **Check console for Web Vitals logs**:
   ```javascript
   [Web Vitals] { name: 'LCP', value: 1234, rating: 'good' }
   [Web Vitals] { name: 'CLS', value: 0.05, rating: 'good' }
   [Web Vitals] { name: 'INP', value: 123, rating: 'good' }
   ```
4. **Check Logflare** - you should see `web_vital` events
5. **Check Google Analytics** - after a few minutes, go to:
   - Reports → Engagement → Events → `web_vital`

---

## 📊 What You'll Get After Setup

### Logflare Dashboard
- **Page Views**: Every page navigation tracked
- **Custom Events**: User interactions (add to cart, checkout, etc.)
- **Client Errors**: Automatic error capture with stack traces
- **Web Vitals**: LCP, INP, CLS, FCP, TTFB metrics
- **User Context**: UserAgent, screen size, viewport, referrer

### Google Analytics Dashboard
- **Real-time Users**: See live visitors on your site
- **Page Views**: Most popular pages
- **User Flow**: How users navigate your site
- **Demographics**: Age, gender, location (if enabled)
- **Acquisition**: Where users come from
- **Engagement**: Time on site, bounce rate
- **Conversions**: Goal tracking (orders, signups, etc.)
- **Web Vitals**: Performance metrics over time

---

## 🚀 Production Deployment

When deploying to production, you'll need to set these environment variables in Cloudflare:

### Via Cloudflare Dashboard
1. Go to Cloudflare Pages → Your Project → Settings → Environment Variables
2. Add for **Production**:
   ```
   NEXT_PUBLIC_LOGFLARE_API_KEY = YKyrP1S-ey4h
   NEXT_PUBLIC_LOGFLARE_SOURCE_ID = e8d5ad5d-6d9d-45cc-9c34-1f2e7cc21db1
   NEXT_PUBLIC_LOGFLARE_DEBUG = false
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = G-ABC1234567 (your real ID)
   ```

### Via Wrangler (Alternative)
```bash
# Logflare (if using different source for production)
wrangler pages secret put NEXT_PUBLIC_LOGFLARE_API_KEY
wrangler pages secret put NEXT_PUBLIC_LOGFLARE_SOURCE_ID

# Google Analytics
wrangler pages secret put NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
```

**Note**: For public environment variables (NEXT_PUBLIC_*), using Cloudflare Dashboard is easier than wrangler secrets.

---

## 🔍 Advanced: Separate Logflare Sources

If you want separate Logflare sources for different environments:

### Development Source (current)
```bash
NEXT_PUBLIC_LOGFLARE_SOURCE_ID=e8d5ad5d-6d9d-45cc-9c34-1f2e7cc21db1
```

### Create Production Source
1. Go to https://logflare.app
2. Click **Create Source**
3. Name: "Band of Bakers - Production Client"
4. Copy the new Source ID
5. Use in production environment variables

**Benefits**:
- Separate dev and prod logs
- Easier debugging
- More accurate analytics

---

## 📚 Additional Resources

### Google Analytics
- **GA4 Documentation**: https://support.google.com/analytics/answer/9304153
- **Event Tracking**: https://developers.google.com/analytics/devguides/collection/ga4/events
- **E-commerce Tracking**: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

### Logflare
- **Dashboard**: https://logflare.app
- **Documentation**: https://logflare.app/guides
- **API Reference**: https://logflare.app/docs/api

### Web Vitals
- **web.dev Guide**: https://web.dev/vitals/
- **Metrics Definitions**: https://web.dev/articles/vitals
- **Optimization Guide**: https://web.dev/fast/

---

## ✅ Checklist

Before going live, make sure:

- [ ] Google Analytics Measurement ID obtained
- [ ] `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` set in `.env.local`
- [ ] Dev server restarted
- [ ] Page views appearing in Logflare dashboard
- [ ] Real-time users showing in Google Analytics
- [ ] Web Vitals being tracked (check console)
- [ ] Production environment variables configured in Cloudflare
- [ ] Test in production after deployment

---

**Last Updated**: 2025-11-27
**Status**: Logflare ✅ Configured | Google Analytics ⏳ Waiting for Measurement ID
