-- Add gallery_images column to programs table
-- Run this in Supabase SQL Editor

-- Add gallery_images column to store array of image URLs
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

-- Add comment to document the column
COMMENT ON COLUMN programs.gallery_images IS 'Array of image URLs for program gallery (max 5 images)';

-- Update RLS policy to include the new column (if needed)
-- The existing policies should automatically include this column

-- Verify the update
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'programs' 
AND column_name = 'gallery_images';