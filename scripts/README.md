# Scripts

This directory contains utility scripts for the Band of Bakers project.

## Cache Cleaning

When encountering build issues or persistent errors, use the cache cleaning scripts:

### Quick Cache Clean

```bash
npm run clean-cache
# or
pnpm clean-cache
```

This script clears:

- Next.js build cache (`.next`)
- Node.js/TypeScript caches (`node_modules/.cache`, `.turbo`, `.eslintcache`)
- Package manager caches (npm/yarn/pnpm)
- Build artifacts (`coverage`, `.nyc_output`, `dist`, `build`)
- Log files and system files (`.DS_Store`, `Thumbs.db`)

### Complete Clean & Reinstall

```bash
npm run clean-all
# or
pnpm clean-all
```

This script:

1. Runs the cache cleaning script
2. Removes `node_modules` directory
3. Reinstalls all dependencies fresh

**Use this when cache cleaning alone doesn't resolve issues.**

## Script Details

### clean-cache.sh

A comprehensive bash script that safely clears all caches and build artifacts with:

- Color-coded output for better visibility
- Safe checks before removing files
- Cross-platform compatibility (macOS, Linux, Windows with WSL)
- Package manager detection (pnpm, yarn, npm)
- Detailed progress reporting

### Exit Codes

- `0`: Success - all caches cleared
- `1`: Error during cleanup (check output for details)

## Troubleshooting

If you continue to experience build issues after running these scripts:

1. Ensure you're using the latest version of Node.js
2. Check that your environment variables are set correctly
3. Try running `pnpm run build` with verbose logging: `DEBUG=* pnpm run build`
4. If using Docker, try rebuilding the container
5. Check the [main README](../README.md) for additional troubleshooting steps
