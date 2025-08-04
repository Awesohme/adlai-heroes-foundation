-- Fix Programs Table Schema - Add Missing SEO Columns
-- Run this in Supabase SQL Editor to fix the missing meta_title column error

-- Add missing SEO columns to programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Add missing SEO columns to blog_posts table (if not exist)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Update existing programs with basic SEO data
UPDATE programs 
SET 
  meta_title = title,
  meta_description = description
WHERE meta_title IS NULL;

-- Update existing blog posts with basic SEO data
UPDATE blog_posts 
SET 
  meta_title = title,
  meta_description = excerpt
WHERE meta_title IS NULL;

-- Show updated table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'programs' 
ORDER BY ordinal_position;