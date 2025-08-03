-- Hero Slides Table
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

-- Partners Table
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url VARCHAR(255),
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON hero_slides(active, order_index);
CREATE INDEX IF NOT EXISTS idx_partners_active_order ON partners(active, order_index);

-- Insert default hero slide
INSERT INTO hero_slides (title, subtitle, image_url, button_text, button_link, order_index, active) VALUES
('Empowering Futures, One Child at a Time', 'The Adlai Heroes Foundation is dedicated to supporting underprivileged children through education, healthcare, and community development.', 'https://res.cloudinary.com/dcvuzffgj/image/upload/v1754226708/Adlai_heroes_nq7ugl.jpg', 'Donate Now', '/donate', 1, true);

-- Enable Row Level Security
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view active hero slides" ON hero_slides
  FOR SELECT USING (active = true);

CREATE POLICY "Public can view active partners" ON partners
  FOR SELECT USING (active = true);

-- Create policies for admin access (service role)
CREATE POLICY "Service role can manage hero slides" ON hero_slides
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage partners" ON partners
  FOR ALL USING (auth.role() = 'service_role');