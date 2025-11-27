/**
 * Update Image Paths to Folder Structure
 *
 * Updates all image references to use the new organized folder structure
 *
 * Usage: node scripts/update-image-paths-to-folders.js
 */

const fs = require('fs').promises;
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

// Mapping of old paths to new folder-based paths
const PATH_MAPPINGS = [
  // Hero images
  { old: '/hero-artisan-bread.jpg', new: '/images_hero/artisan-bread.jpg' },
  { old: 'hero-artisan-bread.jpg', new: 'images_hero/artisan-bread.jpg' },

  // Logos - all sizes
  { old: '/logo-bandofbakers-256.png', new: '/images_logos/bandofbakers-256.png' },
  { old: 'logo-bandofbakers-256.png', new: 'images_logos/bandofbakers-256.png' },
  { old: '/logo-bandofbakers-512.png', new: '/images_logos/bandofbakers-512.png' },
  { old: 'logo-bandofbakers-512.png', new: 'images_logos/bandofbakers-512.png' },
  { old: '/logo-bandofbakers-1200.png', new: '/images_logos/bandofbakers-1200.png' },
  { old: 'logo-bandofbakers-1200.png', new: 'images_logos/bandofbakers-1200.png' },

  // Team photos
  { old: '/team-mike.webp', new: '/images_team/mike.webp' },
  { old: 'team-mike.webp', new: 'images_team/mike.webp' },
  { old: '/team-jon.webp', new: '/images_team/jon.webp' },
  { old: 'team-jon.webp', new: 'images_team/jon.webp' },

  // Instagram gallery
  { old: '/instagram/gallery-instagram-01.jpg', new: '/images_gallery/instagram-01.jpg' },
  { old: '/instagram/gallery-instagram-02.jpg', new: '/images_gallery/instagram-02.jpg' },
  { old: '/instagram/gallery-instagram-03.jpg', new: '/images_gallery/instagram-03.jpg' },
  { old: '/instagram/gallery-instagram-04.jpg', new: '/images_gallery/instagram-04.jpg' },
  { old: '/instagram/gallery-instagram-05.jpg', new: '/images_gallery/instagram-05.jpg' },
  { old: '/instagram/gallery-instagram-06.jpg', new: '/images_gallery/instagram-06.jpg' },
];

const FILES_TO_UPDATE = [
  'src/components/home/sticky-hero.tsx',
  'src/components/navbar/logo.tsx',
  'src/components/footer.tsx',
  'src/app/layout.tsx',
  'src/components/seo/structured-data.tsx',
  'src/components/instagram-feed.tsx',
  'src/lib/mocks/about.ts',
  'src/lib/constants/frontend.ts',
];

async function updateFileReferences(filePath, mappings) {
  const fullPath = path.join(__dirname, '..', filePath);

  try {
    let content = await fs.readFile(fullPath, 'utf-8');
    let modified = false;
    const replacements = [];

    for (const mapping of mappings) {
      if (content.includes(mapping.old)) {
        const count = (content.match(new RegExp(mapping.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        content = content.split(mapping.old).join(mapping.new);
        modified = true;
        replacements.push({ old: mapping.old, new: mapping.new, count });
      }
    }

    if (modified) {
      await fs.writeFile(fullPath, content, 'utf-8');
      console.log(`${colors.green}✓${colors.reset} Updated ${filePath}`);
      for (const rep of replacements) {
        console.log(`  ${rep.old} → ${rep.new} (${rep.count} occurrence${rep.count > 1 ? 's' : ''})`);
      }
      return replacements.length;
    } else {
      console.log(`${colors.yellow}○${colors.reset} No changes needed: ${filePath}`);
      return 0;
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`${colors.yellow}○${colors.reset} File not found (skipped): ${filePath}`);
    } else {
      console.error(`${colors.yellow}✗${colors.reset} Error updating ${filePath}:`, error.message);
    }
    return 0;
  }
}

async function main() {
  console.log(`\n${colors.bright}${colors.cyan}Band of Bakers - Update to Folder Structure${colors.reset}\n`);
  console.log('Updating image paths to use organized folders...\n');

  let totalUpdates = 0;

  for (const file of FILES_TO_UPDATE) {
    const updates = await updateFileReferences(file, PATH_MAPPINGS);
    totalUpdates += updates;
    console.log('');
  }

  console.log(`${colors.bright}${colors.green}✅ Complete!${colors.reset}`);
  console.log(`Updated ${totalUpdates} reference${totalUpdates !== 1 ? 's' : ''} across ${FILES_TO_UPDATE.length} files\n`);

  console.log(`${colors.bright}New folder structure:${colors.reset}`);
  console.log('  public/images_hero/ - Hero/banner images');
  console.log('  public/images_logos/ - Brand logos');
  console.log('  public/images_team/ - Team member photos');
  console.log('  public/images_gallery/ - Instagram gallery\n');
}

main().catch(console.error);
