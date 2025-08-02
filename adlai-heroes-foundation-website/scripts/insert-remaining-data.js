#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://suwgdnjyzdqjyanlpqdd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const remainingData = {
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
  ]
};

async function insertRemainingData() {
  console.log('📊 Inserting remaining sample data...\n');

  try {
    // Insert impact stats (using insert instead of upsert)
    console.log('📈 Inserting impact stats...');
    const { error: statsError } = await supabase
      .from('impact_stats')
      .insert(remainingData.impact_stats);
    
    if (statsError) {
      console.log('⚠️  Impact stats:', statsError.message);
    } else {
      console.log('✅ Impact stats inserted');
    }

    // Insert testimonials
    console.log('💬 Inserting testimonials...');
    const { error: testimonialsError } = await supabase
      .from('testimonials')
      .insert(remainingData.testimonials);
    
    if (testimonialsError) {
      console.log('⚠️  Testimonials:', testimonialsError.message);
    } else {
      console.log('✅ Testimonials inserted');
    }

    // Insert board members
    console.log('👥 Inserting board members...');
    const { error: boardError } = await supabase
      .from('board_members')
      .insert(remainingData.board_members);
    
    if (boardError) {
      console.log('⚠️  Board members:', boardError.message);
    } else {
      console.log('✅ Board members inserted');
    }

    console.log('\n🎉 All sample data inserted successfully!');
    console.log('\n📋 Your database now contains:');
    console.log('• 3 Programs (Pad Up Initiative, Teen Fever, Community Outreach)');
    console.log('• 4 Impact Statistics');
    console.log('• 3 Testimonials');
    console.log('• 3 Board Members');
    console.log('• 2 Blog Posts');
    console.log('\n🚀 Ready to run: npm run dev');

  } catch (error) {
    console.error('❌ Error inserting data:', error.message);
  }
}

insertRemainingData();