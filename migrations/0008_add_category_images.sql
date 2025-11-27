-- Migration: Add image_url to product_categories
-- Created: 2025-11-27

ALTER TABLE product_categories ADD COLUMN image_url TEXT;
