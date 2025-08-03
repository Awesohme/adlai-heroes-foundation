-- Impact Timeline Table
CREATE TABLE IF NOT EXISTS impact_timeline (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_impact_timeline_active_year ON impact_timeline(active, year);

-- Insert default timeline data
INSERT INTO impact_timeline (year, title, description, order_index, active) VALUES
(2018, 'Foundation Established', 'Foundation established, initial focus on primary education in one community.', 1, true),
(2019, 'First Healthcare Outreach', 'Launched first healthcare outreach program, reaching 200+ children.', 2, true),
(2020, 'Educational Expansion', 'Expanded educational support to three new communities, providing school supplies.', 3, true),
(2021, 'Vocational Training Launch', 'Initiated vocational training workshops for older children and youth.', 4, true),
(2022, 'Healthcare Partnership', 'Partnered with local clinics to offer free medical check-ups and vaccinations.', 5, true),
(2023, 'Major Milestone', 'Reached over 1,000 beneficiaries across 20 communities.', 6, true),
(2024, 'Digital Literacy Program', 'Launched digital literacy program, equipping children with essential tech skills.', 7, true);

-- Enable Row Level Security
ALTER TABLE impact_timeline ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and service role management
DROP POLICY IF EXISTS "Public can view active timeline items" ON impact_timeline;
DROP POLICY IF EXISTS "Service role can manage timeline items" ON impact_timeline;

CREATE POLICY "Public can view active timeline items" ON impact_timeline
  FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage timeline items" ON impact_timeline
  FOR ALL USING (auth.role() = 'service_role');