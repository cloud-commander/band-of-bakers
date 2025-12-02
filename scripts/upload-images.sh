#!/bin/bash

# Upload all images to R2 bucket
# Script uploads:
# 1. Real product images (from seed-data/*.webp)
# 2. Site images (from seed-data/site/)

set -e

BUCKET="bandofbakers-assets"
ENV_FLAG="--env preview"
SEED_DATA="scripts/seed-data"

echo "📦 Uploading images to R2 bucket: $BUCKET"

# Upload hero images
echo "📸 Uploading hero images..."
for file in $SEED_DATA/site/hero/*.webp; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    r2_path="images/hero/$filename"
    echo "  Uploading $filename -> $r2_path"
    npx wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --remote $ENV_FLAG
  fi
done

# Upload team images
echo "📸 Uploading team images..."
for file in $SEED_DATA/site/team/*.webp; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    r2_path="images/team/$filename"
    echo "  Uploading $filename -> $r2_path"
    npx wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --remote $ENV_FLAG
  fi
done

# Upload real product images
# We need to organize them by category
echo "📸 Uploading real product images..."

# Create a mapping of product slugs to their category slugs
# This is a simplified version - products are categorized based on their image names

# Breads & Loaves
for file in $SEED_DATA/{sourdough,focaccia,wholemeal_loaf,malt_loaf,apple_cinnamon_loaf}-*.webp; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    r2_path="images/products/breads-loaves/$filename"
    echo "  Uploading $filename -> $r2_path"
    npx wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --remote $ENV_FLAG
  fi
done

# Pastries & Bakes
for file in $SEED_DATA/{croissants,cinnamon_knots,savoury_croissants,cheese_swirl,peach_pistachio_pastries,eccles_cakes,flapjacks_brownies}-*.webp; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    r2_path="images/products/pastries-bakes/$filename"
    echo "  Uploading $filename -> $r2_path"
    npx wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --remote $ENV_FLAG
  fi
done

# Cakes & Loaves
for file in $SEED_DATA/{blueberry_cake,coffee_walnut_cake,dundee_cakes,carrot_cake,chocolate_cake}-*.webp; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    r2_path="images/products/cakes-loaves/$filename"
    echo "  Uploading $filename -> $r2_path"
    npx wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --remote $ENV_FLAG
  fi
done

# Tarts & Pies
for file in $SEED_DATA/{large_apple_pie,small_appleblackberry_pies,portuguese_custard_tarts,whole_tarte_au_citron,lemon_meringue_pie}-*.webp; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    r2_path="images/products/tarts-pies/$filename"
    echo "  Uploading $filename -> $r2_path"
    npx wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --remote $ENV_FLAG
  fi
done

# Savoury & Specialities
for file in $SEED_DATA/{curried_beef_mince_pasties,pesto_swirl}-*.webp; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    r2_path="images/products/savoury-specialities/$filename"
    echo "  Uploading $filename -> $r2_path"
    npx wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --remote $ENV_FLAG
  fi
done

# Biscuits & Bars
for file in $SEED_DATA/{frangipane_slice,tiffin_cake_slice,frangipane_slice,millionaire_shortbread,whole_frangipanes,pistacio_pastry}-*.webp; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    r2_path="images/products/biscuits-bars/$filename"
    echo "  Uploading $filename -> $r2_path"
    npx wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --remote $ENV_FLAG
  fi
done

echo "✅ Image upload completed!"
