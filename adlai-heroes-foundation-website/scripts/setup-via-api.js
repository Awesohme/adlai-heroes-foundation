#!/usr/bin/env node

/**
 * Create Supabase tables via HTTP API
 */

const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://suwgdnjyzdqjyanlpqdd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

// SQL to create all tables
const createTablesSQL = `
-- Programs table
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

-- Blog posts table
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

-- Board members table
CREATE TABLE IF NOT EXISTS board_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  bio TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  location TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Impact stats table
CREATE TABLE IF NOT EXISTS impact_stats (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow public read" ON board_members FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON impact_stats FOR SELECT USING (true);
`;

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'suwgdnjyzdqjyanlpqdd.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function setup() {
  console.log('🚀 Creating Supabase tables...\n');
  
  try {
    const result = await executeSQL(createTablesSQL);
    console.log('✅ Tables created successfully!');
    console.log('📊 Now run the data insertion script...');
    
    // Run data insertion
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Sample data
    const sampleData = {
      programs: [
        {
          title: 'Pad Up Initiative',
          slug: 'pad-up-initiative',
          description: 'Providing menstrual hygiene products to young girls',
          content: 'Our Pad Up Initiative ensures girls do not miss school due to lack of menstrual hygiene products.',
          category: 'health',
          published: true
        }
      ],
      impact_stats: [
        {
          title: 'Girls Supported',
          value: '2,500+',
          description: 'Young girls provided with menstrual hygiene products',
          icon: 'users',
          order_index: 1
        }
      ]
    };
    
    // Insert sample data
    await supabase.from('programs').insert(sampleData.programs);
    await supabase.from('impact_stats').insert(sampleData.impact_stats);
    
    console.log('✅ Sample data inserted!');
    console.log('🎉 Setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Manual setup required:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy and paste the SQL from scripts/create-tables.sql');
    console.log('3. Click "Run"');
    console.log('4. Then run the data insertion script');
  }
}

setup();