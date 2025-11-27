# Image Optimization Plan - Band of Bakers v2

**Created**: 2025-11-27
**Status**: Implementation in progress

---

## 📊 Current Image Inventory

### Hero Images
| Current Name | Size | Dimensions | Usage | Issues |
|-------------|------|------------|-------|---------|
| `artisan-bread.jpg` | 898KB | 2072x1378 | Homepage hero | ❌ Too large, needs optimization |

### Logos
| Current Name | Size | Dimensions | Usage | Issues |
|-------------|------|------------|-------|---------|
| `Bandofbakers-logo.png` | 587KB | 853x853 | Metadata, favicon | ❌ Too large, inconsistent naming |
| `Bandofbakers-logo-removebg-preview.png` | 263KB | 500x500 | Various | ❌ Inconsistent naming |

### Profile Images
| Current Name | Size | Dimensions | Usage | Issues |
|-------------|------|------------|-------|---------|
| `mike.webp` | 284KB | Unknown | About page | ⚠️ Check dimensions |
| `jon.webp` | 272KB | Unknown | About page | ⚠️ Check dimensions |

### Instagram Feed
| Current Name | Size | Dimensions | Usage | Issues |
|-------------|------|------------|-------|---------|
| `instagram/instagram-1.jpg` | 74KB | Unknown | Instagram feed | ⚠️ Check dimensions |
| `instagram/instagram-2.jpg` | 46KB | Unknown | Instagram feed | ✅ Reasonable size |
| `instagram/instagram-3.jpg` | 61KB | Unknown | Instagram feed | ⚠️ Check dimensions |
| `instagram/instagram-4.jpg` | 63KB | Unknown | Instagram feed | ⚠️ Check dimensions |
| `instagram/instagram-5.jpg` | 63KB | Unknown | Instagram feed | ⚠️ Check dimensions |
| `instagram/instagram-6.jpg` | 45KB | Unknown | Instagram feed | ✅ Reasonable size |

---

## 🎯 Naming Convention

### Format
```
[category]-[description]-[size?].[ext]
```

### Examples
- `hero-artisan-bread.jpg` - Hero image
- `logo-bandofbakers.png` - Main logo
- `logo-bandofbakers-transparent.png` - Logo without background
- `team-mike.webp` - Team member photo
- `gallery-instagram-01.jpg` - Instagram gallery image

### Categories
- `hero-` - Hero/banner images
- `logo-` - Brand logos
- `team-` - Team member photos
- `product-` - Product images
- `gallery-` - Gallery/Instagram images
- `icon-` - Small icons

---

## ✅ Optimization Targets

### Hero Images
**Target**: 1920x1080 @ quality 85
- Modern web standard resolution
- 16:9 aspect ratio for responsive design
- Target file size: <200KB

### Logos
**PNG (with transparency)**:
- Favicon: 512x512 @ quality 90
- Social: 1200x630 for Open Graph
- General use: 256x256 @ quality 90

### Profile Images
**Target**: 800x800 @ quality 85
- Square format for consistency
- WebP format (already done)
- Target file size: <100KB

### Instagram Gallery
**Target**: 800x800 @ quality 80
- Square format for grid
- Target file size: <60KB each

---

## 🔧 Optimization Commands

### Using ImageMagick (if available)
```bash
# Hero image
convert artisan-bread.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 hero-artisan-bread.jpg

# Logo (preserve transparency)
convert Bandofbakers-logo.png -resize 512x512 -quality 90 logo-bandofbakers-512.png
convert Bandofbakers-logo.png -resize 256x256 -quality 90 logo-bandofbakers-256.png

# Profile images
convert mike.webp -resize 800x800^ -gravity center -extent 800x800 -quality 85 team-mike.webp
convert jon.webp -resize 800x800^ -gravity center -extent 800x800 -quality 85 team-jon.webp

# Instagram images
for i in instagram/instagram-*.jpg; do
  num=$(basename $i .jpg | grep -oE '[0-9]+')
  convert $i -resize 800x800^ -gravity center -extent 800x800 -quality 80 instagram/gallery-instagram-$(printf "%02d" $num).jpg
done
```

### Using Sharp (Node.js)
```javascript
const sharp = require('sharp');

// Hero image
await sharp('artisan-bread.jpg')
  .resize(1920, 1080, { fit: 'cover' })
  .jpeg({ quality: 85, progressive: true })
  .toFile('hero-artisan-bread.jpg');

// Instagram images
for (let i = 1; i <= 6; i++) {
  await sharp(`instagram/instagram-${i}.jpg`)
    .resize(800, 800, { fit: 'cover' })
    .jpeg({ quality: 80, progressive: true })
    .toFile(`instagram/gallery-instagram-${String(i).padStart(2, '0')}.jpg`);
}
```

---

## 📋 Rename Mapping

### Files to Rename

```
# Hero Images
artisan-bread.jpg → hero-artisan-bread.jpg (after optimization)

# Logos
Bandofbakers-logo.png → logo-bandofbakers.png (after optimization to 256x256)
Bandofbakers-logo-removebg-preview.png → DELETE (duplicate, use main logo)

# Profile Images
mike.webp → team-mike.webp (after optimization)
jon.webp → team-jon.webp (after optimization)

# Instagram Gallery
instagram/instagram-1.jpg → instagram/gallery-instagram-01.jpg (after optimization)
instagram/instagram-2.jpg → instagram/gallery-instagram-02.jpg (after optimization)
instagram/instagram-3.jpg → instagram/gallery-instagram-03.jpg (after optimization)
instagram/instagram-4.jpg → instagram/gallery-instagram-04.jpg (after optimization)
instagram/instagram-5.jpg → instagram/gallery-instagram-05.jpg (after optimization)
instagram/instagram-6.jpg → instagram/gallery-instagram-06.jpg (after optimization)
```

---

## 📝 Code Updates Required

### Files to Update

1. **src/components/home/sticky-hero.tsx**
   ```typescript
   // Before
   src="/artisan-bread.jpg"

   // After
   src="/hero-artisan-bread.jpg"
   ```

2. **src/components/navbar/logo.tsx**
   ```typescript
   // Before
   src="/Bandofbakers-logo.png"

   // After
   src="/logo-bandofbakers.png"
   ```

3. **src/app/layout.tsx** (metadata)
   ```typescript
   // Before
   images: ["/Bandofbakers-logo.png"]

   // After
   images: ["/logo-bandofbakers.png"]
   ```

4. **src/components/instagram-feed.tsx**
   ```typescript
   // Before
   `/instagram/instagram-${i}.jpg`

   // After
   `/instagram/gallery-instagram-${String(i).padStart(2, '0')}.jpg`
   ```

5. **src/lib/mocks/about.ts** (team members)
   ```typescript
   // Before
   avatar: "/mike.webp"
   avatar: "/jon.webp"

   // After
   avatar: "/team-mike.webp"
   avatar: "/team-jon.webp"
   ```

---

## 🚀 Implementation Steps

### Phase 1: Manual Optimization (Recommended)
1. Use online tools or local ImageMagick
2. Download optimized images
3. Replace in public folder with new names
4. Update code references

### Phase 2: Automated Script
Create `scripts/optimize-images.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const optimizations = [
    // Hero
    {
      input: 'public/artisan-bread.jpg',
      output: 'public/hero-artisan-bread.jpg',
      width: 1920,
      height: 1080,
      quality: 85,
      format: 'jpeg'
    },
    // Logos
    {
      input: 'public/Bandofbakers-logo.png',
      output: 'public/logo-bandofbakers-256.png',
      width: 256,
      height: 256,
      quality: 90,
      format: 'png'
    },
    {
      input: 'public/Bandofbakers-logo.png',
      output: 'public/logo-bandofbakers-512.png',
      width: 512,
      height: 512,
      quality: 90,
      format: 'png'
    },
    // Team
    {
      input: 'public/mike.webp',
      output: 'public/team-mike.webp',
      width: 800,
      height: 800,
      quality: 85,
      format: 'webp'
    },
    {
      input: 'public/jon.webp',
      output: 'public/team-jon.webp',
      width: 800,
      height: 800,
      quality: 85,
      format: 'webp'
    }
  ];

  for (const opt of optimizations) {
    console.log(`Optimizing ${opt.input}...`);

    const processor = sharp(opt.input)
      .resize(opt.width, opt.height, { fit: 'cover' });

    if (opt.format === 'jpeg') {
      processor.jpeg({ quality: opt.quality, progressive: true });
    } else if (opt.format === 'webp') {
      processor.webp({ quality: opt.quality });
    } else if (opt.format === 'png') {
      processor.png({ quality: opt.quality });
    }

    await processor.toFile(opt.output);
    console.log(`✓ Created ${opt.output}`);
  }

  // Instagram images
  for (let i = 1; i <= 6; i++) {
    const input = `public/instagram/instagram-${i}.jpg`;
    const output = `public/instagram/gallery-instagram-${String(i).padStart(2, '0')}.jpg`;

    console.log(`Optimizing ${input}...`);
    await sharp(input)
      .resize(800, 800, { fit: 'cover' })
      .jpeg({ quality: 80, progressive: true })
      .toFile(output);
    console.log(`✓ Created ${output}`);
  }

  console.log('\n✅ All images optimized!');
  console.log('\nNext steps:');
  console.log('1. Review optimized images');
  console.log('2. Delete old images');
  console.log('3. Update code references');
}

optimizeImages().catch(console.error);
```

Run with:
```bash
pnpm add -D sharp
node scripts/optimize-images.js
```

---

## ✅ Expected Results

### File Size Reductions
| Image | Before | After | Savings |
|-------|--------|-------|---------|
| Hero (artisan-bread) | 898KB | ~180KB | **-80%** |
| Logo (main) | 587KB | ~50KB | **-91%** |
| Mike profile | 284KB | ~80KB | **-72%** |
| Jon profile | 272KB | ~80KB | **-71%** |
| Instagram (avg) | 60KB | ~45KB | **-25%** |

**Total Savings**: ~1.6MB → ~500KB = **-69% reduction**

### Performance Impact
- ✅ **Faster LCP** - Hero loads 80% faster
- ✅ **Better mobile experience** - Smaller downloads
- ✅ **Improved Lighthouse score** - +10-15 points
- ✅ **Reduced bandwidth costs** - Especially on Cloudflare

---

## 📚 Best Practices Going Forward

1. **Always optimize before adding to public folder**
2. **Use naming convention for all new images**
3. **Target max file sizes**:
   - Hero: 200KB
   - Logos: 50KB
   - Products: 100KB
   - Thumbnails: 30KB
4. **Use modern formats**: WebP > JPEG > PNG
5. **Add images to next/image** component, never `<img>`
6. **Test on 3G network** before deployment

---

**Status**: Ready for implementation
**Priority**: High - Impacts Core Web Vitals
