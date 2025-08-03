-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  email VARCHAR(255),
  linkedin_url VARCHAR(255),
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_active_order ON team_members(active, order_index);

-- Insert sample team members
INSERT INTO team_members (name, position, bio, image_url, email, order_index, active) VALUES
('Adlai Heroes', 'Founder & Executive Director', 'Passionate about creating positive change in communities and empowering the next generation of leaders through innovative programs and sustainable initiatives.', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Founder', 'founder@adlaiheroesfoundation.com.ng', 1, true),
('Program Director', 'Programs & Operations Director', 'Leading program development and ensuring effective implementation across all initiatives. Focused on maximizing impact and sustainability of our community programs.', 'https://via.placeholder.com/300x300/3b82f6/ffffff?text=Director', 'programs@adlaiheroesfoundation.com.ng', 2, true);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view active team members" ON team_members
  FOR SELECT USING (active = true);

-- Create policies for admin access (service role)
CREATE POLICY "Service role can manage team members" ON team_members
  FOR ALL USING (auth.role() = 'service_role');