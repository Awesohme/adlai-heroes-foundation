-- Fix authors table to show only "Adlai Heroes Team" by default
-- Remove individual author entries and keep only the team

-- Remove individual author entries (Dr. Sarah Johnson, Michael Okonkwo, etc.)
DELETE FROM authors WHERE name != 'Adlai Heroes Team';

-- Update the Adlai Heroes Team entry to remove individual email
UPDATE authors 
SET 
  email = NULL,
  bio = 'Official Adlai Heroes Foundation content'
WHERE name = 'Adlai Heroes Team';

-- Insert Adlai Heroes Team if it doesn't exist
INSERT INTO authors (name, email, bio, is_active) VALUES
('Adlai Heroes Team', NULL, 'Official Adlai Heroes Foundation content', true)
ON CONFLICT (name) DO UPDATE SET
  email = NULL,
  bio = 'Official Adlai Heroes Foundation content',
  is_active = true;