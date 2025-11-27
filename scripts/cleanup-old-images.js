/**
 * Cleanup Old Images Script
 *
 * Removes old, unoptimized images after verification that new images work.
 *
 * Usage: node scripts/cleanup-old-images.js
 */

const fs = require('fs').promises;
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Files to delete
const FILES_TO_DELETE = [
  'artisan-bread.jpg',
  'Bandofbakers-logo.png',
  'Bandofbakers-logo-removebg-preview.png',
  'mike.webp',
  'jon.webp',
  '20250927_081454-EDIT.jpg', // Old unused image
  'instagram/instagram-1.jpg',
  'instagram/instagram-2.jpg',
  'instagram/instagram-3.jpg',
  'instagram/instagram-4.jpg',
  'instagram/instagram-5.jpg',
  'instagram/instagram-6.jpg',
];

// Folders to delete (after files are removed)
const FOLDERS_TO_DELETE = [
  'instagram',
];

async function deleteFile(filePath) {
  const fullPath = path.join(PUBLIC_DIR, filePath);

  try {
    await fs.access(fullPath);
    await fs.unlink(fullPath);
    console.log(`${colors.green}✓${colors.reset} Deleted: ${filePath}`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`${colors.yellow}○${colors.reset} Already deleted: ${filePath}`);
    } else {
      console.error(`${colors.red}✗${colors.reset} Error deleting ${filePath}:`, error.message);
    }
    return false;
  }
}

async function deleteFolder(folderPath) {
  const fullPath = path.join(PUBLIC_DIR, folderPath);

  try {
    await fs.access(fullPath);
    await fs.rmdir(fullPath);
    console.log(`${colors.green}✓${colors.reset} Deleted folder: ${folderPath}`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`${colors.yellow}○${colors.reset} Folder already deleted: ${folderPath}`);
    } else if (error.code === 'ENOTEMPTY') {
      console.log(`${colors.yellow}○${colors.reset} Folder not empty (skipped): ${folderPath}`);
    } else {
      console.error(`${colors.red}✗${colors.reset} Error deleting folder ${folderPath}:`, error.message);
    }
    return false;
  }
}

async function main() {
  console.log(`\n${colors.bright}${colors.cyan}Band of Bakers - Cleanup Old Images${colors.reset}\n`);

  console.log(`${colors.yellow}${colors.bright}⚠️  WARNING${colors.reset}`);
  console.log('This will permanently delete old image files.');
  console.log('Make sure you have:');
  console.log('1. Tested the site with new images');
  console.log('2. Verified all images load correctly');
  console.log('3. Checked the site on multiple pages\n');

  console.log('Files to be deleted:');
  FILES_TO_DELETE.forEach(file => console.log(`  - ${file}`));
  console.log('\nFolders to be deleted:');
  FOLDERS_TO_DELETE.forEach(folder => console.log(`  - ${folder}/`));
  console.log('');

  // Simple confirmation (in a real script, you might want readline-sync or inquirer)
  console.log(`${colors.bright}Proceeding with deletion...${colors.reset}\n`);

  let deletedCount = 0;

  for (const file of FILES_TO_DELETE) {
    const deleted = await deleteFile(file);
    if (deleted) deletedCount++;
  }

  console.log('');

  for (const folder of FOLDERS_TO_DELETE) {
    await deleteFolder(folder);
  }

  console.log(`\n${colors.bright}${colors.green}✅ Cleanup Complete!${colors.reset}`);
  console.log(`Deleted ${deletedCount} file${deletedCount !== 1 ? 's' : ''}\n`);
}

main().catch(console.error);
