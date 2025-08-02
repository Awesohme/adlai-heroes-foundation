-- Update schema for SEO and homepage content management
-- Run this in Supabase SQL Editor after the initial tables

-- Add SEO fields to existing tables
ALTER TABLE programs ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS og_image TEXT;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Create homepage content table for editable sections
CREATE TABLE IF NOT EXISTS homepage_content (
  id BIGSERIAL PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for homepage content
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON homepage_content FOR SELECT USING (active = true);

-- Insert default homepage sections
INSERT INTO homepage_content (section_key, title, subtitle, content, image_url, button_text, button_link, meta_title, meta_description) 
VALUES 
  ('hero', 
   'Empowering Heroes, Building Futures', 
   'Creating safe havens for children and making the world a better place through education, healthcare, and community empowerment.',
   'The Adlai Heroes Foundation is dedicated to transforming the lives of vulnerable children and teenagers across Nigeria and beyond. We believe every child deserves a chance to thrive, learn, and grow in a safe environment.',
   '/placeholder.svg?height=600&width=1200',
   'Join Our Mission',
   '/donate',
   'Adlai Heroes Foundation - Empowering Children Across Nigeria',
   'Join the Adlai Heroes Foundation in creating safe havens for children through education, healthcare, and community empowerment programs across Nigeria.'
  ),
  ('about_preview',
   'Our Impact Story',
   'Building stronger communities one child at a time',
   'Since our founding, we have been committed to addressing the basic, mental, financial, and emotional needs of vulnerable children. Our comprehensive approach ensures sustainable change that lasts generations.',
   '/placeholder.svg?height=400&width=600',
   'Learn More About Us',
   '/about',
   'About Adlai Heroes Foundation - Our Mission and Impact',
   'Learn about Adlai Heroes Foundation mission to create safe havens for children through education, healthcare, and community empowerment across Nigeria.'
  )
ON CONFLICT (section_key) DO NOTHING;

-- Create storage bucket for images if it doesn't exist
-- Note: This needs to be done via Supabase dashboard or API, not SQL
-- We'll handle this in the application code

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homepage_content_updated_at BEFORE UPDATE ON homepage_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();