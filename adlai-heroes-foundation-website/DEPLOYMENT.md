# Deployment Guide - Adlai Heroes Foundation Website

## 🚀 Quick Deploy (Recommended)

### Step 1: Deploy Strapi CMS (Free)

**Option A: Render (Recommended - Actually Free)**
1. Go to [Render.com](https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Select the `adlai-strapi-cms` folder
5. Set build command: `npm install && npm run build`
6. Set start command: `npm start`
7. Add environment variables:
   ```
   DATABASE_URL=postgresql://...  (Use free PostgreSQL from Render)
   JWT_SECRET=your-random-string-here
   API_TOKEN_SALT=your-random-string-here
   ADMIN_JWT_SECRET=your-random-string-here
   APP_KEYS=key1,key2,key3,key4
   NODE_ENV=production
   ```
8. Create free PostgreSQL database on Render
9. Deploy and note the URL (e.g., `https://your-app.onrender.com`)

**Option B: Vercel + PlanetScale (MySQL)**
1. Can't directly host Strapi on Vercel (serverless limitation)
2. Use [PlanetScale](https://planetscale.com) for free MySQL database
3. Host Strapi on Render with PlanetScale database

**Option C: Supabase + Render**
1. Create free [Supabase](https://supabase.com) PostgreSQL database
2. Deploy Strapi on Render
3. Connect to Supabase database URL

**Option D: 100% Free Alternative - Static + Netlify CMS**
If Strapi proves too resource-heavy for free tiers:
1. Use [Netlify CMS](https://netlifycms.org) (Git-based CMS)
2. Deploy on Vercel with Netlify CMS admin
3. Content stored as markdown files in Git
4. Zero hosting costs, but less dynamic

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