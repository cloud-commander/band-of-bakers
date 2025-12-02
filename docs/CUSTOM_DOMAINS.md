# Custom Domain Setup for Cloudflare Pages

## Current Status

- **Project Name**: `bandofbakers-v2`
- **Default Domain**: `bandofbakers-v2.pages.dev`
- **Preview Deployments**: `[deployment-id].bandofbakers-v2.pages.dev`

## Required Custom Domains

### Staging

- **Domain**: `staging.bandofbakers.co.uk`
- **Points to**: Preview branch deployments (branch: staging)

### Production

- **Domain**: `bandofbakers.co.uk` and `www.bandofbakers.co.uk`
- **Points to**: Production branch deployments (branch: main)

## Setup Steps

### 1. Navigate to Cloudflare Pages Dashboard

Visit: https://dash.cloudflare.com/[your-account-id]/pages/view/bandofbakers-v2

### 2. Add Custom Domain

#### For Staging:

1. Click **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `staging.bandofbakers.co.uk`
4. Select environment: **Preview**
5. Select preview branch: **staging**
6. Click **Continue**
7. Cloudflare will add the necessary DNS records automatically (if domain is managed by Cloudflare)

#### For Production:

1. Click **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `bandofbakers.co.uk`
4. Select environment: **Production**
5. Click **Continue**
6. Repeat for `www.bandofbakers.co.uk`

### 3. Verify DNS Records

If `bandofbakers.co.uk` is managed in Cloudflare DNS, the records will be added automatically:

#### Staging

```
CNAME staging.bandofbakers.co.uk → bandofbakers-v2.pages.dev
```

#### Production

```
CNAME bandofbakers.co.uk → bandofbakers-v2.pages.dev
CNAME www.bandofbakers.co.uk → bandofbakers-v2.pages.dev
```

### 4. SSL Certificate

Cloudflare will automatically provision SSL certificates for custom domains. This typically takes 1-2 minutes.

## Verification

Once configured, verify:

- ✅ `https://staging.bandofbakers.co.uk` resolves to preview deployments
- ✅ `https://bandofbakers.co.uk` resolves to production
- ✅ SSL certificate is valid
- ✅ Health check passes: `https://staging.bandofbakers.co.uk/api/health`

## Notes

- Custom domains are configured per-project, not per-deployment
- Preview branches can have custom domains pointing to them
- Production branches get the primary custom domain
- DNS propagation may take a few minutes
