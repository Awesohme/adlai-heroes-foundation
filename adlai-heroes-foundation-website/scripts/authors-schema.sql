-- Create authors table for consistent author management
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for authors
CREATE OR REPLACE FUNCTION update_authors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER authors_updated_at_trigger
    BEFORE UPDATE ON authors
    FOR EACH ROW
    EXECUTE FUNCTION update_authors_updated_at();

-- Insert default authors
INSERT INTO authors (name, email, bio) VALUES
('Adlai Heroes Team', 'admin@adlaiheroesfoundation.com.ng', 'Official Adlai Heroes Foundation team account'),
('Dr. Sarah Johnson', 'sarah@adlaiheroesfoundation.com.ng', 'Healthcare Program Director'),
('Michael Okonkwo', 'michael@adlaiheroesfoundation.com.ng', 'Community Outreach Coordinator')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authors are publicly viewable" ON authors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authors can be managed by authenticated users" ON authors
    FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_authors_active ON authors (is_active);
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors (name);