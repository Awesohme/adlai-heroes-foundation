-- Adlai Heroes Foundation Database Schema
-- Run this in Supabase SQL Editor

-- 1. Programs table
CREATE TABLE IF NOT EXISTS programs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  featured_image TEXT,
  category TEXT CHECK (category IN ('education', 'health', 'empowerment', 'community')),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Board members table
CREATE TABLE IF NOT EXISTS board_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  bio TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  location TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Impact stats table
CREATE TABLE IF NOT EXISTS impact_stats (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for public read access
CREATE POLICY "Allow public read" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow public read" ON board_members FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON impact_stats FOR SELECT USING (true);