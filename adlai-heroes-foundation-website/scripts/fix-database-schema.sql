-- Fix missing columns in programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Fix missing columns in blog_posts table  
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Fix missing columns in homepage_content table
ALTER TABLE homepage_content
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Fix missing columns in pages table
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Update existing programs with default SEO values
UPDATE programs 
SET 
    meta_description = COALESCE(meta_description, description),
    meta_keywords = COALESCE(meta_keywords, title || ', ' || category || ', adlai heroes foundation')
WHERE meta_description IS NULL OR meta_keywords IS NULL;

-- Update existing blog posts with default SEO values  
UPDATE blog_posts
SET 
    meta_description = COALESCE(meta_description, excerpt),
    meta_keywords = COALESCE(meta_keywords, title || ', blog, adlai heroes foundation')
WHERE meta_description IS NULL OR meta_keywords IS NULL;

-- Check the updated structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('programs', 'blog_posts', 'homepage_content', 'pages')
    AND table_schema = 'public'
    AND column_name LIKE 'meta_%' OR column_name = 'og_image'
ORDER BY table_name, column_name;