-- Add sample data to test admin dashboard
-- Only insert if tables are empty

-- Programs
INSERT INTO programs (title, slug, description, content, category, published, created_at, updated_at)
SELECT * FROM (VALUES 
  ('Pad Up Initiative', 'pad-up-initiative', 'Providing menstrual hygiene products to young girls in underserved communities', 'Our Pad Up Initiative ensures that girls do not miss school due to lack of menstrual hygiene products. We distribute reusable pads and provide education on menstrual health.', 'health', true, NOW(), NOW()),
  ('Teen Fever Program', 'teen-fever-program', 'Empowering teenagers with life skills and career guidance', 'Teen Fever is our flagship youth empowerment program that provides mentorship and career guidance to help teenagers discover their potential.', 'empowerment', true, NOW(), NOW()),
  ('Community Outreach', 'community-outreach', 'Building stronger communities through direct engagement', 'Our community outreach programs focus on identifying local needs and providing sustainable solutions that strengthen community bonds.', 'community', true, NOW(), NOW())
) AS v(title, slug, description, content, category, published, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM programs LIMIT 1);

-- Impact Stats
INSERT INTO impact_stats (title, value, description, order_index, created_at)
SELECT * FROM (VALUES 
  ('Girls Supported', '2,500+', 'Young girls provided with menstrual hygiene products', 1, NOW()),
  ('Communities Reached', '15', 'Underserved communities across Nigeria', 2, NOW()),
  ('Teens Empowered', '1,200+', 'Teenagers trained through our programs', 3, NOW()),
  ('Years of Impact', '5+', 'Years of continuous community service', 4, NOW())
) AS v(title, value, description, order_index, created_at)
WHERE NOT EXISTS (SELECT 1 FROM impact_stats LIMIT 1);

-- Testimonials
INSERT INTO testimonials (name, content, location, featured, created_at)
SELECT * FROM (VALUES 
  ('Aisha Mohammed', 'The Pad Up Initiative changed my life. I no longer miss school during my period, and I feel more confident about my health and future.', 'Lagos, Nigeria', true, NOW()),
  ('Ibrahim Adamu', 'Teen Fever helped me discover my passion for technology. Now I am studying computer science in university thanks to their mentorship.', 'Abuja, Nigeria', true, NOW()),
  ('Fatima Yusuf', 'Through the community outreach program, our village now has access to clean water. Thank you Adlai Heroes Foundation!', 'Kano, Nigeria', false, NOW()),
  ('Grace Okafor', 'The foundation provided me with school supplies and mentorship. I graduated with honors and now work as a teacher.', 'Port Harcourt, Nigeria', false, NOW())
) AS v(name, content, location, featured, created_at)
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, published, created_at, updated_at)
SELECT * FROM (VALUES 
  ('Empowering Girls Through Education', 'empowering-girls-through-education', 'How our programs are breaking barriers and creating opportunities for young women.', 'Education is the most powerful tool we can use to change the world. At Adlai Heroes Foundation, we believe every girl deserves access to quality education and the resources needed to succeed. Our programs focus on removing barriers that prevent girls from attending school, including providing menstrual hygiene products and educational support.', 'Admin', true, NOW(), NOW()),
  ('Community Impact Report 2024', 'community-impact-report-2024', 'A comprehensive look at our achievements and the communities we have served this year.', 'This year has been remarkable for the Adlai Heroes Foundation. We have expanded our reach to 15 communities, supported over 2,500 girls, and empowered more than 1,200 teenagers through our various programs. This report highlights our key achievements and the stories of transformation from the communities we serve.', 'Admin', true, NOW(), NOW()),
  ('The Teen Fever Success Story', 'teen-fever-success-story', 'Meet the young entrepreneurs who transformed their communities through our Teen Fever program.', 'Our Teen Fever program has produced amazing success stories. From young entrepreneurs starting their own businesses to students excelling in their academic pursuits, the program continues to prove that when given the right support and guidance, teenagers can achieve extraordinary things.', 'Admin', false, NOW(), NOW())
) AS v(title, slug, excerpt, content, author, published, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_posts LIMIT 1);

-- Board Members
INSERT INTO board_members (name, position, bio, order_index, created_at)
SELECT * FROM (VALUES 
  ('Dr. Adlai Johnson', 'Executive Director', 'Dr. Johnson founded the Adlai Heroes Foundation with a vision to create lasting change in underserved communities. With over 15 years of experience in nonprofit leadership and community development.', 1, NOW()),
  ('Mrs. Sarah Okafor', 'Programs Director', 'Sarah leads our program development and implementation efforts. She holds a Masters in Social Work and has dedicated her career to youth empowerment and community development.', 2, NOW()),
  ('Mr. David Adebayo', 'Operations Manager', 'David ensures the smooth operation of all foundation activities. His background in project management and logistics helps us deliver programs efficiently and effectively.', 3, NOW()),
  ('Ms. Grace Ukwu', 'Community Liaison', 'Grace serves as our primary connection to the communities we serve. Her deep understanding of local cultures and needs helps us develop programs that truly make a difference.', 4, NOW())
) AS v(name, position, bio, order_index, created_at)
WHERE NOT EXISTS (SELECT 1 FROM board_members LIMIT 1);

-- Check what was inserted
SELECT 'programs' as table_name, COUNT(*) as count FROM programs
UNION ALL
SELECT 'impact_stats', COUNT(*) FROM impact_stats
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'board_members', COUNT(*) FROM board_members;