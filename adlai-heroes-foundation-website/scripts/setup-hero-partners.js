const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://suwgdnjyzdqjyanlpqdd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('🚀 Creating hero_slides table...');
    
    // Create hero_slides table
    const { error: heroError } = await supabase.rpc('exec_sql', { 
      sql: `
        CREATE TABLE IF NOT EXISTS hero_slides (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          subtitle TEXT,
          image_url TEXT NOT NULL,
          button_text VARCHAR(100),
          button_link VARCHAR(255),
          order_index INTEGER NOT NULL DEFAULT 0,
          active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (heroError) {
      console.log('ℹ️ Using direct table creation...');
      
      // Try direct table creation
      const { error: directError } = await supabase
        .from('hero_slides')
        .select('*')
        .limit(1);
        
      if (directError && directError.code === 'PGRST116') {
        console.log('✅ Creating tables via SQL...');
        
        // Try creating via raw SQL
        const createHeroSlides = `
          CREATE TABLE IF NOT EXISTS hero_slides (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle TEXT,
            image_url TEXT NOT NULL,
            button_text VARCHAR(100),
            button_link VARCHAR(255),
            order_index INTEGER NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        console.log('Hero slides table schema ready');
      }
    }

    console.log('🚀 Creating partners table...');
    
    const createPartners = `
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url TEXT NOT NULL,
        website_url VARCHAR(255),
        order_index INTEGER NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    console.log('Partners table schema ready');

    // Insert default hero slide
    console.log('📝 Inserting default hero slide...');
    const { error: insertError } = await supabase
      .from('hero_slides')
      .insert([{
        title: 'Empowering Futures, One Child at a Time',
        subtitle: 'The Adlai Heroes Foundation is dedicated to supporting underprivileged children through education, healthcare, and community development.',
        image_url: 'https://res.cloudinary.com/dcvuzffgj/image/upload/v1754226708/Adlai_heroes_nq7ugl.jpg',
        button_text: 'Donate Now',
        button_link: '/donate',
        order_index: 1,
        active: true
      }]);

    if (insertError) {
      console.log('ℹ️ Hero slide may already exist or table needs to be created manually');
      console.log('Please create the tables manually in Supabase Dashboard:');
      console.log('1. Go to Table Editor in Supabase Dashboard');
      console.log('2. Create hero_slides table with columns: id, title, subtitle, image_url, button_text, button_link, order_index, active, created_at, updated_at');
      console.log('3. Create partners table with columns: id, name, logo_url, website_url, order_index, active, created_at');
    } else {
      console.log('✅ Default hero slide inserted successfully!');
    }

    console.log('✅ Setup complete! Please verify tables in Supabase Dashboard.');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('Please create these tables manually in Supabase Dashboard:');
    console.log('\n1. hero_slides table:');
    console.log('   - id (int8, primary key)');
    console.log('   - title (varchar)');
    console.log('   - subtitle (text)');
    console.log('   - image_url (text)');
    console.log('   - button_text (varchar)');
    console.log('   - button_link (varchar)');
    console.log('   - order_index (int4, default 0)');
    console.log('   - active (bool, default true)');
    console.log('   - created_at (timestamptz, default now())');
    console.log('   - updated_at (timestamptz, default now())');
    console.log('\n2. partners table:');
    console.log('   - id (int8, primary key)');
    console.log('   - name (varchar)');
    console.log('   - logo_url (text)');
    console.log('   - website_url (varchar)');
    console.log('   - order_index (int4, default 0)');
    console.log('   - active (bool, default true)');
    console.log('   - created_at (timestamptz, default now())');
  }
}

createTables();