#!/bin/bash

# =============================================================================
# Band of Bakers - Cache Cleaning Script
# =============================================================================
# This script clears all caches and build artifacts to resolve build issues
# =============================================================================

set -e  # Exit on any error

echo "🧹 Starting comprehensive cache cleanup..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

print_status "Project root: $PROJECT_ROOT"
echo ""

# =============================================================================
# 1. Clear Next.js build cache
# =============================================================================
print_status "Clearing Next.js build cache (.next)..."
if [ -d ".next" ]; then
    rm -rf .next
    print_success "Removed .next directory"
else
    print_warning ".next directory does not exist"
fi

# =============================================================================
# 2. Clear Node.js and build tool caches
# =============================================================================
print_status "Clearing Node.js and build tool caches..."

# Clear node_modules/.cache
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    print_success "Removed node_modules/.cache"
else
    print_warning "node_modules/.cache does not exist"
fi

# Clear .turbo
if [ -d ".turbo" ]; then
    rm -rf .turbo
    print_success "Removed .turbo directory"
else
    print_warning ".turbo directory does not exist"
fi

# Clear .eslintcache
if [ -f ".eslintcache" ]; then
    rm -f .eslintcache
    print_success "Removed .eslintcache file"
else
    print_warning ".eslintcache does not exist"
fi

# =============================================================================
# 3. Clear package manager caches
# =============================================================================
print_status "Clearing package manager caches..."

# Detect package manager and clear appropriate cache
if [ -f "pnpm-lock.yaml" ]; then
    print_status "Detected pnpm - clearing pnpm store..."
    if command -v pnpm >/dev/null 2>&1; then
        pnpm store prune || print_warning "pnpm store prune failed (this is usually ok)"
        print_success "Cleared pnpm store"
    else
        print_warning "pnpm not found - skipping pnpm cache cleanup"
    fi
elif [ -f "yarn.lock" ]; then
    print_status "Detected Yarn - clearing Yarn cache..."
    if command -v yarn >/dev/null 2>&1; then
        yarn cache clean || print_warning "yarn cache clean failed (this is usually ok)"
        print_success "Cleared Yarn cache"
    else
        print_warning "yarn not found - skipping yarn cache cleanup"
    fi
elif [ -f "package-lock.json" ]; then
    print_status "Detected npm - clearing npm cache..."
    if command -v npm >/dev/null 2>&1; then
        npm cache clean --force || print_warning "npm cache clean failed (this is usually ok)"
        print_success "Cleared npm cache"
    else
        print_warning "npm not found - skipping npm cache cleanup"
    fi
else
    print_warning "No lock file detected - skipping package manager cache cleanup"
fi

# =============================================================================
# 4. Clear other build artifacts and cache directories
# =============================================================================
print_status "Clearing other build artifacts and cache directories..."

# Coverage and testing artifacts
if [ -d "coverage" ]; then
    rm -rf coverage
    print_success "Removed coverage directory"
else
    print_warning "coverage directory does not exist"
fi

# NYC test coverage artifacts
if [ -d ".nyc_output" ]; then
    rm -rf .nyc_output
    print_success "Removed .nyc_output directory"
else
    print_warning ".nyc_output directory does not exist"
fi

# Build output directories
if [ -d "dist" ]; then
    rm -rf dist
    print_success "Removed dist directory"
else
    print_warning "dist directory does not exist"
fi

# Legacy build directory
if [ -d "build" ]; then
    rm -rf build
    print_success "Removed build directory"
else
    print_warning "build directory does not exist"
fi

# Log files
if ls *.log 1> /dev/null 2>&1; then
    rm -f *.log
    print_success "Removed log files (*.log)"
else
    print_warning "No log files found to remove"
fi

# =============================================================================
# 5. Additional cleanup for specific tools
# =============================================================================
print_status "Running additional cleanup..."

# Clear TypeScript build cache if it exists
if [ -d "node_modules/.cache/typescript" ]; then
    rm -rf node_modules/.cache/typescript
    print_success "Removed TypeScript cache"
fi

# Clear any .DS_Store files (macOS)
if find . -name ".DS_Store" -type f 1>/dev/null 2>&1; then
    find . -name ".DS_Store" -delete
    print_success "Removed .DS_Store files"
fi

# Clear any Thumbs.db files (Windows)
if find . -name "Thumbs.db" -type f 1>/dev/null 2>&1; then
    find . -name "Thumbs.db" -delete
    print_success "Removed Thumbs.db files"
fi

# =============================================================================
# 6. Final verification
# =============================================================================
print_status "Verifying cleanup..."

# Check if any cache directories still exist
REMAINING_CACHES=()
if [ -d ".next" ]; then
    REMAINING_CACHES+=(".next")
fi
if [ -d "node_modules/.cache" ]; then
    REMAINING_CACHES+=("node_modules/.cache")
fi
if [ -d ".turbo" ]; then
    REMAINING_CACHES+=(".turbo")
fi

if [ ${#REMAINING_CACHES[@]} -eq 0 ]; then
    print_success "All major caches have been cleared successfully!"
else
    print_warning "Some cache directories still exist: ${REMAINING_CACHES[*]}"
fi

echo ""
echo "================================================"
print_success "Cache cleanup completed successfully!"
echo ""
print_status "Next steps:"
echo "  1. Run 'pnpm install' (or npm install) to ensure dependencies are fresh"
echo "  2. Run 'pnpm run build' to verify the build works"
echo "  3. If you still have issues, try deleting node_modules and reinstalling"
echo ""
print_status "For future cache issues, just run: npm run clean-cache (or pnpm clean-cache)"