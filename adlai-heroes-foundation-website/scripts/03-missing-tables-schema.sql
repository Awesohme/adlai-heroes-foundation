-- Missing tables that need to be created for admin functionality

-- Board Members Table (if not exists)
CREATE TABLE IF NOT EXISTS board_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  bio TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hero Slides Table (if not exists)
CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  button_text_2 VARCHAR(100),
  button_link_2 VARCHAR(255),
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners Table (if not exists)
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url VARCHAR(255),
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read" ON board_members;
DROP POLICY IF EXISTS "Public can view active hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Public can view active partners" ON partners;
DROP POLICY IF EXISTS "Service role can manage hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Service role can manage partners" ON partners;
DROP POLICY IF EXISTS "Service role can manage board members" ON board_members;

-- Create policies
CREATE POLICY "Allow public read" ON board_members FOR SELECT USING (true);

CREATE POLICY "Public can view active hero slides" ON hero_slides
  FOR SELECT USING (active = true);

CREATE POLICY "Public can view active partners" ON partners
  FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage hero slides" ON hero_slides
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage partners" ON partners
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage board members" ON board_members
  USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_board_members_order ON board_members(order_index);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON hero_slides(active, order_index);
CREATE INDEX IF NOT EXISTS idx_partners_active_order ON partners(active, order_index);

-- Insert default hero slide if none exists
INSERT INTO hero_slides (title, subtitle, image_url, button_text, button_link, button_text_2, button_link_2, order_index, active) 
SELECT 'Empowering Futures, One Child at a Time', 
       'The Adlai Heroes Foundation is dedicated to supporting underprivileged children through education, healthcare, and community development.', 
       'https://res.cloudinary.com/dcvuzffgj/image/upload/v1754226708/Adlai_heroes_nq7ugl.jpg', 
       'Donate Now', 
       '/donate', 
       'Learn More', 
       '/about', 
       1, 
       true
WHERE NOT EXISTS (SELECT 1 FROM hero_slides);