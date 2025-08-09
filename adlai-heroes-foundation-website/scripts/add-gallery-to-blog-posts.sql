-- Add gallery_images column to blog_posts table
-- This column will store an array of image URLs for blog post galleries

ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add comment to document the column purpose
COMMENT ON COLUMN blog_posts.gallery_images IS 'Array of image URLs for blog post gallery (max 5 images)';

-- Update any existing posts to have empty gallery arrays if null
UPDATE blog_posts 
SET gallery_images = ARRAY[]::TEXT[] 
WHERE gallery_images IS NULL;