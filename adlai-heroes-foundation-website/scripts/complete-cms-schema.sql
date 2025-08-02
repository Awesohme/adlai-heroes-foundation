-- Complete CMS Schema for all website content
-- Run this in Supabase SQL Editor

-- Create pages table for static page content
CREATE TABLE IF NOT EXISTS pages (
  id BIGSERIAL PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create sections table for reusable content blocks
CREATE TABLE IF NOT EXISTS content_sections (
  id BIGSERIAL PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  page_key TEXT,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create footer content table
CREATE TABLE IF NOT EXISTS footer_content (
  id BIGSERIAL PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  links JSONB,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create navigation menu table
CREATE TABLE IF NOT EXISTS navigation_menu (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  parent_id BIGINT REFERENCES navigation_menu(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for new tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menu ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON pages FOR SELECT USING (published = true);
CREATE POLICY "Allow public read" ON content_sections FOR SELECT USING (active = true);
CREATE POLICY "Allow public read" ON footer_content FOR SELECT USING (active = true);
CREATE POLICY "Allow public read" ON navigation_menu FOR SELECT USING (active = true);

-- Insert default pages
INSERT INTO pages (page_key, title, slug, content, meta_title, meta_description) 
VALUES 
  ('home', 'Home', '/', 'Welcome to Adlai Heroes Foundation', 'Adlai Heroes Foundation - Empowering Children Across Nigeria', 'Join the Adlai Heroes Foundation in creating safe havens for children through education, healthcare, and community empowerment programs across Nigeria.'),
  ('about', 'About Us', 'about', 'Learn about our mission, vision, and impact story.', 'About Adlai Heroes Foundation - Our Mission and Impact', 'Learn about Adlai Heroes Foundation mission to create safe havens for children through education, healthcare, and community empowerment across Nigeria.'),
  ('programs', 'Our Programs', 'programs', 'Discover our education, health, and empowerment programs.', 'Our Programs - Adlai Heroes Foundation', 'Explore Adlai Heroes Foundation programs including education, healthcare, and community empowerment initiatives across Nigeria.'),
  ('blog', 'Blog', 'blog', 'Read our latest news and stories.', 'Blog - Adlai Heroes Foundation', 'Read the latest news, stories, and updates from Adlai Heroes Foundation programs and impact across Nigeria.'),
  ('donate', 'Donate', 'donate', 'Make a difference in children lives today.', 'Donate - Support Adlai Heroes Foundation', 'Support Adlai Heroes Foundation mission by donating to help create safe havens for children across Nigeria.'),
  ('volunteer', 'Volunteer', 'volunteer', 'Join our mission as a volunteer.', 'Volunteer - Join Adlai Heroes Foundation', 'Become a volunteer with Adlai Heroes Foundation and help create positive impact in children lives across Nigeria.'),
  ('contact', 'Contact Us', 'contact', 'Get in touch with our team.', 'Contact Adlai Heroes Foundation', 'Get in touch with Adlai Heroes Foundation team to learn more about our programs and how you can get involved.')
ON CONFLICT (page_key) DO NOTHING;

-- Insert default homepage content sections
INSERT INTO content_sections (section_key, page_key, title, subtitle, content, image_url, button_text, button_link, order_index) 
VALUES 
  ('hero', 'home', 'Empowering Heroes, Building Futures', 'Creating safe havens for children and making the world a better place through education, healthcare, and community empowerment.', 'The Adlai Heroes Foundation is dedicated to transforming the lives of vulnerable children and teenagers across Nigeria and beyond. We believe every child deserves a chance to thrive, learn, and grow in a safe environment.', '/placeholder.svg?height=600&width=1200', 'Join Our Mission', '/donate', 1),
  ('about_preview', 'home', 'Our Impact Story', 'Building stronger communities one child at a time', 'Since our founding, we have been committed to addressing the basic, mental, financial, and emotional needs of vulnerable children. Our comprehensive approach ensures sustainable change that lasts generations.', '/placeholder.svg?height=400&width=600', 'Learn More About Us', '/about', 2),
  ('cta_section', 'home', 'Ready to Make a Difference?', 'Join thousands of supporters helping us create lasting change', 'Your support helps us provide education, healthcare, and empowerment opportunities to children across Nigeria. Every contribution, no matter the size, creates real impact.', '/placeholder.svg?height=300&width=800', 'Donate Now', '/donate', 3),
  ('volunteer_hero', 'volunteer', 'Become a Hero in Someone Story', 'Join our community of dedicated volunteers making real impact', 'At Adlai Heroes Foundation, volunteers are the heart of our mission. Whether you have a few hours a month or can commit to regular involvement, there is a place for you in our team.', '/placeholder.svg?height=500&width=1000', 'Apply to Volunteer', '#volunteer-form', 1),
  ('volunteer_opportunities', 'volunteer', 'How You Can Help', 'Multiple ways to get involved and make a difference', 'From mentoring children to helping with events, from teaching skills to administrative support - find the volunteer opportunity that matches your passion and schedule.', '/placeholder.svg?height=400&width=600', 'View Opportunities', '#opportunities', 2)
ON CONFLICT (section_key) DO NOTHING;

-- Insert default footer content
INSERT INTO footer_content (section_key, title, content, links, order_index) 
VALUES 
  ('about', 'About Adlai Heroes Foundation', 'Creating safe havens for children and making the world a better place through education, healthcare, and community empowerment across Nigeria.', '[]', 1),
  ('quick_links', 'Quick Links', '', '[{"label": "About Us", "href": "/about"}, {"label": "Our Programs", "href": "/programs"}, {"label": "Blog", "href": "/blog"}, {"label": "Volunteer", "href": "/volunteer"}, {"label": "Contact", "href": "/contact"}]', 2),
  ('programs', 'Our Programs', '', '[{"label": "Education", "href": "/programs#education"}, {"label": "Healthcare", "href": "/programs#health"}, {"label": "Empowerment", "href": "/programs#empowerment"}, {"label": "Community", "href": "/programs#community"}]', 3),
  ('contact_info', 'Contact Info', '', '[{"label": "Email", "href": "mailto:info@adlaiheroesfoundation.org"}, {"label": "Phone", "href": "tel:+234-XXX-XXX-XXXX"}, {"label": "Address", "href": "#", "text": "Lagos, Nigeria"}]', 4),
  ('social_media', 'Follow Us', '', '[{"label": "Facebook", "href": "#"}, {"label": "Twitter", "href": "#"}, {"label": "Instagram", "href": "#"}, {"label": "LinkedIn", "href": "#"}]', 5)
ON CONFLICT (section_key) DO NOTHING;

-- Insert default navigation menu
INSERT INTO navigation_menu (label, href, order_index) 
VALUES 
  ('Home', '/', 1),
  ('About', '/about', 2),
  ('Programs', '/programs', 3),
  ('Blog', '/blog', 4),
  ('Volunteer', '/volunteer', 5),
  ('Donate', '/donate', 6),
  ('Contact', '/contact', 7)
ON CONFLICT DO NOTHING;

-- Create triggers for updated_at
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON footer_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();