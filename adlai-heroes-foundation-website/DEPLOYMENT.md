# Deployment Guide - Adlai Heroes Foundation Website

## 🚀 Quick Deploy (Recommended)

### Step 1: Deploy Strapi CMS (Free)

**Option A: Supabase Backend (Recommended - Truly Free Forever)**

1. **Create Supabase Project**
   - Go to [Supabase.com](https://supabase.com) and create account (no card required)
   - Click "New Project"
   - Organization: Personal (free)
   - Project Name: `adlai-heroes-foundation`
   - Database Password: Create secure password
   - Region: Select closest to your users
   - Click "Create new project"

2. **Get API Keys**
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role` key (for admin operations)

3. **Create Database Tables**
   - Go to Database → Tables
   - Create tables for your content:
     ```sql
     -- Programs table
     CREATE TABLE programs (
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
     CREATE TABLE blog_posts (
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
     CREATE TABLE board_members (
       id BIGSERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       position TEXT,
       bio TEXT,
       image TEXT,
       order_index INTEGER DEFAULT 0,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
     );

     -- Testimonials table
     CREATE TABLE testimonials (
       id BIGSERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       content TEXT NOT NULL,
       image TEXT,
       location TEXT,
       featured BOOLEAN DEFAULT false,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
     );

     -- Impact stats table
     CREATE TABLE impact_stats (
       id BIGSERIAL PRIMARY KEY,
       title TEXT NOT NULL,
       value TEXT NOT NULL,
       description TEXT,
       icon TEXT,
       order_index INTEGER DEFAULT 0,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
     );
     ```

4. **Set Row Level Security (RLS)**
   - Go to Authentication → Policies
   - For each table, create policies:
     ```sql
     -- Allow public read access
     CREATE POLICY "Allow public read" ON programs FOR SELECT USING (published = true);
     CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (published = true);
     CREATE POLICY "Allow public read" ON board_members FOR SELECT USING (true);
     CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
     CREATE POLICY "Allow public read" ON impact_stats FOR SELECT USING (true);
     ```

5. **Enable Storage (for images)**
   - Go to Storage → Create bucket
   - Bucket name: `adlai-images`
   - Public bucket: Yes (for website images)
   - Create storage policies for public access

6. **Install Supabase in Next.js**
   ```bash
   npm install @supabase/supabase-js
   npm install @supabase/ssr  # For server-side rendering
   ```

7. **Configure Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

8. **Create Supabase Client**
   Create `lib/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

9. **Create Content Admin Interface**
   - Build simple admin pages in Next.js
   - Or use Supabase Dashboard for content management
   - Example admin route: `/admin/programs`

10. **Deploy to Vercel**
    - Connect GitHub repository to Vercel
    - Add environment variables in Vercel dashboard
    - Deploy automatically on git push

**Option B: Static Site + Decap CMS (Formerly Netlify CMS)**
1. **Deploy to Vercel/Netlify**: Static Next.js site (free forever)
2. **Add Decap CMS**: File-based CMS stored in git
3. **Content Storage**: Markdown files in your repository
4. **Admin Interface**: `/admin` route for content editing
5. **Benefits**: 
   - Zero hosting costs
   - Version control for content
   - Works offline
   - No database needed

**Option C: PlanetScale + Vercel API Routes (MySQL Alternative)**
1. Create [PlanetScale](https://planetscale.com) account (no card required)
2. Create database → get MySQL connection string (1GB free forever)
3. Use Vercel API Routes for backend logic
4. Build custom API endpoints in `/api` folder
5. Connect to PlanetScale from API routes

**Option D: Render (Requires Card Verification)**
1. Go to [Render.com](https://render.com) and create account
2. Connect your GitHub account
3. **Create PostgreSQL Database First**:
   - Click "New" → "PostgreSQL"
   - Database Name: `adlai-strapi-db`
   - User: `strapi_user` 
   - Plan: **Free** ($0/month)
   - Click "Create Database"
   - **Copy the Internal Database URL** (starts with `postgresql://`)

4. **Create Strapi Web Service**:
   - Click "New" → "Web Service"
   - Connect Repository: `Awesohme/adlai-heroes-foundation`
   - **Important**: Set Root Directory to `.` (not a subfolder)
   - Build Command: `cd adlai-strapi-cms && npm install && npm run build`
   - Start Command: `cd adlai-strapi-cms && npm start`
   - Plan: **Free** ($0/month)

5. **Environment Variables** (click Advanced → Add Environment Variable):
   ```
   DATABASE_URL=<paste-internal-database-url-from-step-3>
   JWT_SECRET=your-super-secret-jwt-key-32-chars-min
   API_TOKEN_SALT=your-api-token-salt-32-chars-min
   ADMIN_JWT_SECRET=your-admin-jwt-secret-32-chars-min
   APP_KEYS=key1,key2,key3,key4
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=10000
   ```

6. **Deploy** - Note the URL (e.g., `https://adlai-strapi.onrender.com`)

**Option E: Cloudflare Workers + D1 Database**
1. Create [Cloudflare](https://cloudflare.com) account (no card required)
2. Use D1 SQLite database (free tier)
3. Deploy API as Cloudflare Workers (100k requests/day free)
4. Global edge network for performance
5. Connect Next.js frontend to Workers API

**Option F: GitHub Pages + Static CMS (Ultimate Free)**
1. Deploy static Next.js to GitHub Pages (unlimited free)
2. Use Decap CMS or Forestry for content management
3. Content stored as markdown files in repository
4. Zero monthly costs, version-controlled content
5. Perfect for nonprofits with budget constraints

### Step 2: Deploy Next.js Frontend (Free)

**Vercel (Recommended)**
1. Go to [Vercel.com](https://vercel.com)
2. Import project from GitHub
3. Set environment variables in Vercel dashboard:
   ```
   STRAPI_API_URL=https://your-strapi-app.onrender.com
   STRAPI_API_TOKEN=your-api-token-from-strapi
   NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-app.onrender.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```
4. Deploy automatically

### Step 3: Set up Cloudinary (Free)

1. Create account at [Cloudinary.com](https://cloudinary.com)
2. Note your Cloud Name from dashboard
3. Update `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in Vercel
4. Create unsigned upload preset:
   - Go to Settings > Upload
   - Add upload preset
   - Set to "Unsigned"
   - Note the preset name

### Step 4: Configure Strapi

1. Access your Strapi admin: `https://your-strapi-app.onrender.com/admin`
2. Create admin account
3. Go to Settings > API Tokens
4. Create new token with "Full access"
5. Copy token and add to Vercel environment variables
6. Import content types from `strapi-content-types.json`

## 🔧 Manual Setup

### Prerequisites
- Node.js 18-22
- npm or yarn
- Git

### Local Development

**1. Clone Repository**
```bash
git clone <your-repo-url>
cd adlai-heroes-foundation-website
```

**2. Install Dependencies**
```bash
npm install --legacy-peer-deps
```

**3. Set up Strapi Locally**
```bash
cd adlai-strapi-cms
npx create-strapi-app@latest . --quickstart
# Follow setup wizard
```

**4. Configure Environment Variables**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

**5. Start Development Servers**
```bash
# Terminal 1: Strapi
cd adlai-strapi-cms
npm run develop

# Terminal 2: Next.js
npm run dev
```

### Production Build

**1. Build Strapi**
```bash
cd adlai-strapi-cms
npm run build
npm start
```

**2. Build Next.js**
```bash
npm run build
npm start
```

## 🌐 Domain Setup

### Custom Domain (Optional)

**For Vercel:**
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

**For Railway/Render:**
1. Go to your service settings
2. Add custom domain
3. Update DNS records

## 🔐 Environment Variables Reference

### Next.js (.env.local)

**For Supabase Backend (Recommended):**
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**For Strapi Backend (Legacy):**
```env
# Required
STRAPI_API_URL=https://your-strapi-url.com
STRAPI_API_TOKEN=your-strapi-api-token
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-url.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Strapi
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Security
JWT_SECRET=your-jwt-secret
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
APP_KEYS=key1,key2,key3,key4

# Optional
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📊 Cost Breakdown

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited sites
- **Render**: 750 hours/month, 512MB RAM, 1GB PostgreSQL
- **Cloudinary**: 25GB storage, 25GB bandwidth  
- **Supabase**: 500MB database, 2GB bandwidth
- **PlanetScale**: 1 database, 1GB storage

### Expected Monthly Costs
- **Domain**: ~$1/month (optional)
- **Everything else**: $0 (completely free!)
- **Total**: $0-1/month vs $50+/month WordPress hosting

### Scaling Costs (if needed later)
- **Render Pro**: $7/month for 512MB more RAM
- **Cloudinary Pro**: $89/month for more storage
- **Supabase Pro**: $25/month for 8GB database

## 🚨 Troubleshooting

### Common Issues

**1. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

**2. Strapi Connection Issues**
- Verify API URL is correct
- Check API token permissions
- Ensure Strapi is running and accessible

**3. Image Loading Issues**
- Verify Cloudinary cloud name
- Check CORS settings in Strapi
- Ensure images are properly uploaded

**4. Deployment Failures**
- Check environment variables are set
- Verify build commands are correct
- Review deployment logs

### Performance Optimization

**1. Enable Next.js Features**
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'your-strapi-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  }
}
```

**2. Strapi Optimization**
- Enable response caching
- Optimize database queries
- Use CDN for media files

## 📈 Monitoring

### Analytics Setup
1. Add Google Analytics ID to environment variables
2. Set up Google Search Console
3. Monitor Core Web Vitals in Vercel

### Performance Monitoring
- Use Vercel Analytics (free)
- Monitor Strapi performance in Railway/Render
- Set up uptime monitoring

## 🔄 Content Management Workflow

### Adding New Content
1. Access Strapi admin panel
2. Create/edit content
3. Publish changes
4. Content appears on website automatically (ISR)

### Updating Images
1. Upload to Cloudinary or Strapi media library
2. Use in content editor
3. Images are automatically optimized

### SEO Optimization
1. Fill meta title and description fields
2. Use proper heading hierarchy
3. Add alt text to images
4. Monitor search console for issues

## 🆘 Support

### Getting Help
- Check deployment logs first
- Review environment variables
- Test locally before deploying
- Consult documentation links below

### Useful Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io/)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

---

**Last Updated**: August 2025  
**Deployment Status**: Ready for Production