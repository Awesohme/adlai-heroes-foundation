-- Add second button fields to hero_slides table
ALTER TABLE hero_slides 
ADD COLUMN IF NOT EXISTS button_text_2 VARCHAR(100),
ADD COLUMN IF NOT EXISTS button_link_2 VARCHAR(255);