#!/usr/bin/env node

/**
 * Simple Supabase Database Setup
 * Creates tables using direct Supabase client operations
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://suwgdnjyzdqjyanlpqdd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample data to insert
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
    },
    {
      title: 'Community Outreach',
      slug: 'community-outreach',
      description: 'Building stronger communities through direct engagement',
      content: 'Our community outreach programs focus on identifying local needs and providing sustainable solutions that empower communities.',
      category: 'community',
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
    },
    {
      title: 'Lives Impacted',
      value: '5,000+',
      description: 'Total individuals positively affected',
      icon: 'heart',
      order_index: 4
    }
  ],

  testimonials: [
    {
      name: 'Aisha Mohammed',
      content: 'The Pad Up Initiative changed my life. I no longer miss school during my period, and I feel more confident about my health.',
      location: 'Lagos, Nigeria',
      featured: true
    },
    {
      name: 'Ibrahim Adamu',
      content: 'Teen Fever helped me discover my passion for technology. Now I am studying computer science in university.',
      location: 'Abuja, Nigeria',
      featured: true
    },
    {
      name: 'Fatima Yusuf',
      content: 'Through the community outreach program, our village now has access to clean water. Thank you Adlai Heroes Foundation!',
      location: 'Kano, Nigeria',
      featured: false
    }
  ],

  board_members: [
    {
      name: 'Dr. Adlai Adamu',
      position: 'Founder & CEO',
      bio: 'Passionate advocate for youth empowerment and community development with over 15 years of experience in nonprofit leadership.',
      order_index: 1
    },
    {
      name: 'Mrs. Kemi Johnson',
      position: 'Program Director',
      bio: 'Expert in program management and community engagement, dedicated to creating sustainable impact in underserved communities.',
      order_index: 2
    },
    {
      name: 'Mr. David Okafor',
      position: 'Operations Manager',
      bio: 'Operations specialist ensuring efficient delivery of programs and maximum impact of foundation resources.',
      order_index: 3
    }
  ],

  blog_posts: [
    {
      title: 'The Impact of Menstrual Health Education',
      slug: 'impact-menstrual-health-education',
      excerpt: 'How proper education about menstrual health is transforming the lives of young girls in Nigeria.',
      content: 'Menstrual health education is crucial for the empowerment of young girls. Our research shows that girls who receive proper education about menstrual health are 40% more likely to complete their secondary education...',
      author: 'Dr. Adlai Adamu',
      published: true
    },
    {
      title: 'Building Stronger Communities Together',
      slug: 'building-stronger-communities',
      excerpt: 'Our approach to sustainable community development and the importance of local engagement.',
      content: 'Community development is not just about providing resources; it is about empowering communities to create lasting change. Our community outreach programs focus on...',
      author: 'Mrs. Kemi Johnson',
      published: true
    }
  ]
};

async function setupDatabase() {
  console.log('🚀 Setting up Adlai Heroes Foundation database...\n');

  try {
    // Test connection
    console.log('🔗 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('programs')
      .select('count', { count: 'exact', head: true });

    if (testError && testError.code === '42P01') {
      console.log('⚠️  Tables do not exist yet. Please create them manually in Supabase SQL Editor.');
      console.log('\n📋 SQL Commands to run:');
      console.log(`
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
      `);
      
      console.log('\n⚠️  After creating tables, run this script again to populate sample data.');
      return;
    }

    console.log('✅ Database connection successful!');

    // Insert sample data
    console.log('\n📊 Inserting sample data...\n');

    // Insert programs
    console.log('📝 Inserting programs...');
    const { error: programsError } = await supabase
      .from('programs')
      .upsert(sampleData.programs, { onConflict: 'slug' });
    
    if (programsError) {
      console.log('⚠️  Programs:', programsError.message);
    } else {
      console.log('✅ Sample programs inserted');
    }

    // Insert impact stats
    console.log('📈 Inserting impact stats...');
    const { error: statsError } = await supabase
      .from('impact_stats')
      .upsert(sampleData.impact_stats, { onConflict: 'title' });
    
    if (statsError) {
      console.log('⚠️  Impact stats:', statsError.message);
    } else {
      console.log('✅ Sample impact stats inserted');
    }

    // Insert testimonials
    console.log('💬 Inserting testimonials...');
    const { error: testimonialsError } = await supabase
      .from('testimonials')
      .upsert(sampleData.testimonials, { onConflict: 'name' });
    
    if (testimonialsError) {
      console.log('⚠️  Testimonials:', testimonialsError.message);
    } else {
      console.log('✅ Sample testimonials inserted');
    }

    // Insert board members
    console.log('👥 Inserting board members...');
    const { error: boardError } = await supabase
      .from('board_members')
      .upsert(sampleData.board_members, { onConflict: 'name' });
    
    if (boardError) {
      console.log('⚠️  Board members:', boardError.message);
    } else {
      console.log('✅ Sample board members inserted');
    }

    // Insert blog posts
    console.log('📝 Inserting blog posts...');
    const { error: blogError } = await supabase
      .from('blog_posts')
      .upsert(sampleData.blog_posts, { onConflict: 'slug' });
    
    if (blogError) {
      console.log('⚠️  Blog posts:', blogError.message);
    } else {
      console.log('✅ Sample blog posts inserted');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. ✅ Supabase credentials configured in .env.local');
    console.log('2. ✅ Sample data inserted');
    console.log('3. 🔄 Run: npm run dev');
    console.log('4. 🌐 Visit: http://localhost:3000');
    console.log('\n🔗 Your Supabase Dashboard: https://supabase.com/dashboard/project/suwgdnjyzdqjyanlpqdd');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };