/**
 * Image Optimization Script
 *
 * Optimizes and renames images according to Band of Bakers naming convention.
 * Requires: pnpm add -D sharp
 *
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeImage({ input, output, width, height, quality, format }) {
  const inputPath = path.join(PUBLIC_DIR, input);
  const outputPath = path.join(PUBLIC_DIR, output);

  console.log(`${colors.cyan}Processing:${colors.reset} ${input}`);

  try {
    const beforeSize = await getFileSize(inputPath);

    const processor = sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      });

    if (format === 'jpeg') {
      processor.jpeg({ quality, progressive: true });
    } else if (format === 'webp') {
      processor.webp({ quality });
    } else if (format === 'png') {
      processor.png({ quality });
    }

    await processor.toFile(outputPath);

    const afterSize = await getFileSize(outputPath);
    const savings = beforeSize - afterSize;
    const savingsPercent = ((savings / beforeSize) * 100).toFixed(1);

    console.log(`${colors.green}✓${colors.reset} ${output}`);
    console.log(`  Before: ${formatBytes(beforeSize)}`);
    console.log(`  After:  ${formatBytes(afterSize)}`);
    console.log(`  Saved:  ${formatBytes(savings)} (${savingsPercent}%)\n`);

    return { before: beforeSize, after: afterSize, savings };
  } catch (error) {
    console.error(`${colors.yellow}✗ Failed to process ${input}:${colors.reset}`, error.message);
    return { before: 0, after: 0, savings: 0 };
  }
}

async function main() {
  console.log(`\n${colors.bright}${colors.cyan}Band of Bakers - Image Optimization${colors.reset}\n`);
  console.log('Starting image optimization...\n');

  const optimizations = [
    // Hero Images
    {
      input: 'artisan-bread.jpg',
      output: 'hero-artisan-bread.jpg',
      width: 1920,
      height: 1080,
      quality: 85,
      format: 'jpeg'
    },

    // Logos
    {
      input: 'Bandofbakers-logo.png',
      output: 'logo-bandofbakers-256.png',
      width: 256,
      height: 256,
      quality: 90,
      format: 'png'
    },
    {
      input: 'Bandofbakers-logo.png',
      output: 'logo-bandofbakers-512.png',
      width: 512,
      height: 512,
      quality: 90,
      format: 'png'
    },
    {
      input: 'Bandofbakers-logo.png',
      output: 'logo-bandofbakers-1200.png',
      width: 1200,
      height: 630,
      quality: 90,
      format: 'png'
    },

    // Team Photos
    {
      input: 'mike.webp',
      output: 'team-mike.webp',
      width: 800,
      height: 800,
      quality: 85,
      format: 'webp'
    },
    {
      input: 'jon.webp',
      output: 'team-jon.webp',
      width: 800,
      height: 800,
      quality: 85,
      format: 'webp'
    }
  ];

  let totalBefore = 0;
  let totalAfter = 0;

  // Process defined optimizations
  for (const opt of optimizations) {
    const result = await optimizeImage(opt);
    totalBefore += result.before;
    totalAfter += result.after;
  }

  // Process Instagram images
  console.log(`${colors.cyan}Processing Instagram gallery...${colors.reset}\n`);

  for (let i = 1; i <= 6; i++) {
    const result = await optimizeImage({
      input: `instagram/instagram-${i}.jpg`,
      output: `instagram/gallery-instagram-${String(i).padStart(2, '0')}.jpg`,
      width: 800,
      height: 800,
      quality: 80,
      format: 'jpeg'
    });
    totalBefore += result.before;
    totalAfter += result.after;
  }

  // Summary
  const totalSavings = totalBefore - totalAfter;
  const totalSavingsPercent = ((totalSavings / totalBefore) * 100).toFixed(1);

  console.log(`${colors.bright}${colors.green}✅ Optimization Complete!${colors.reset}\n`);
  console.log(`${colors.bright}Summary:${colors.reset}`);
  console.log(`  Total Before: ${formatBytes(totalBefore)}`);
  console.log(`  Total After:  ${formatBytes(totalAfter)}`);
  console.log(`  Total Saved:  ${formatBytes(totalSavings)} (${totalSavingsPercent}%)\n`);

  console.log(`${colors.bright}${colors.yellow}Next Steps:${colors.reset}`);
  console.log('1. Review the optimized images in public folder');
  console.log('2. Run: node scripts/update-image-refs.js');
  console.log('3. Test the site: pnpm dev');
  console.log('4. Delete old images if everything works');
  console.log('');
}

// Check if sharp is installed
try {
  require.resolve('sharp');
  main().catch(console.error);
} catch (error) {
  console.error(`\n${colors.yellow}Error: Sharp is not installed${colors.reset}\n`);
  console.log('Please run: pnpm add -D sharp\n');
  process.exit(1);
}
