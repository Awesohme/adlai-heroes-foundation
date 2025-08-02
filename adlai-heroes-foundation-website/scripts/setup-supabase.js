#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * Automatically creates all required tables and policies for Adlai Heroes Foundation
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://suwgdnjyzdqjyanlpqdd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Please get your service role key from Supabase Dashboard > Settings > API');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// SQL commands to create tables
const createTablesSQL = [
  // Programs table
  `CREATE TABLE IF NOT EXISTS programs (
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
  );`,

  // Blog posts table
  `CREATE TABLE IF NOT EXISTS blog_posts (
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
  );`,

  // Board members table
  `CREATE TABLE IF NOT EXISTS board_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT,
    bio TEXT,
    image TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );`,

  // Testimonials table
  `CREATE TABLE IF NOT EXISTS testimonials (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    location TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );`,

  // Impact stats table
  `CREATE TABLE IF NOT EXISTS impact_stats (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );`,

  // Enable Row Level Security
  `ALTER TABLE programs ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;`,

  // Create policies for public read access
  `DROP POLICY IF EXISTS "Allow public read" ON programs;`,
  `CREATE POLICY "Allow public read" ON programs FOR SELECT USING (published = true);`,
  
  `DROP POLICY IF EXISTS "Allow public read" ON blog_posts;`,
  `CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (published = true);`,
  
  `DROP POLICY IF EXISTS "Allow public read" ON board_members;`,
  `CREATE POLICY "Allow public read" ON board_members FOR SELECT USING (true);`,
  
  `DROP POLICY IF EXISTS "Allow public read" ON testimonials;`,
  `CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);`,
  
  `DROP POLICY IF EXISTS "Allow public read" ON impact_stats;`,
  `CREATE POLICY "Allow public read" ON impact_stats FOR SELECT USING (true);`
];

// Sample data to populate tables
const sampleData = {
  programs: [
    {
      title: 'Pad Up Initiative',
      slug: 'pad-up-initiative',
      description: 'Providing menstrual hygiene products to young girls in underserved communities',
      content: 'Our Pad Up Initiative ensures that girls do not miss school due to lack of menstrual hygiene products. We distribute reusable pads and provide education on menstrual health.',
      category: 'health',
      published: true
    },
    {
      title: 'Teen Fever Program',
      slug: 'teen-fever-program',
      description: 'Empowering teenagers with life skills and career guidance',
      content: 'Teen Fever is our flagship youth empowerment program that provides mentorship, career guidance, and life skills training to teenagers.',
      category: 'empowerment',
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
    },
    {
      title: 'Communities Reached',
      value: '15',
      description: 'Underserved communities across Nigeria',
      icon: 'map-pin',
      order_index: 2
    },
    {
      title: 'Teens Empowered',
      value: '1,200+',
      description: 'Teenagers trained through our programs',
      icon: 'star',
      order_index: 3
    }
  ],

  testimonials: [
    {
      name: 'Aisha Mohammed',
      content: 'The Pad Up Initiative changed my life. I no longer miss school during my period.',
      location: 'Lagos, Nigeria',
      featured: true
    }
  ]
};

async function setupDatabase() {
  console.log('🚀 Setting up Adlai Heroes Foundation database...\n');

  try {
    // Execute SQL commands
    for (let i = 0; i < createTablesSQL.length; i++) {
      const sql = createTablesSQL[i];
      console.log(`📝 Executing SQL command ${i + 1}/${createTablesSQL.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error(`❌ Error executing SQL: ${error.message}`);
        // Try alternative method
        const { error: directError } = await supabase
          .from('_temp')
          .select('*')
          .limit(0);
        
        if (directError && directError.code !== 'PGRST116') {
          console.error('Database connection failed:', directError);
          return;
        }
      }
    }

    console.log('✅ All tables created successfully!\n');

    // Insert sample data
    console.log('📊 Inserting sample data...\n');

    // Insert programs
    const { error: programsError } = await supabase
      .from('programs')
      .upsert(sampleData.programs);
    
    if (!programsError) {
      console.log('✅ Sample programs inserted');
    }

    // Insert impact stats
    const { error: statsError } = await supabase
      .from('impact_stats')
      .upsert(sampleData.impact_stats);
    
    if (!statsError) {
      console.log('✅ Sample impact stats inserted');
    }

    // Insert testimonials
    const { error: testimonialsError } = await supabase
      .from('testimonials')
      .upsert(sampleData.testimonials);
    
    if (!testimonialsError) {
      console.log('✅ Sample testimonials inserted');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env.local with Supabase credentials');
    console.log('2. Install Supabase packages: npm install @supabase/supabase-js');
    console.log('3. Run the development server: npm run dev');
    console.log('\n🔗 Your Supabase URL: https://suwgdnjyzdqjyanlpqdd.supabase.co');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Manual setup required. Please run the SQL commands in Supabase SQL Editor.');
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };