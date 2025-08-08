# Adlai Heroes Foundation Website

A modern, cost-effective website for the Adlai Heroes Foundation nonprofit organization, built with Next.js 15 and Supabase backend.

## 🎯 Project Overview

This project rebuilds the Adlai Heroes Foundation website using modern JAMstack architecture to reduce hosting costs while maintaining professional quality and SEO compliance.

### Original Site
- **URL**: https://adlaiheroesfoundation.com.ng/
- **Current Issue**: High hosting costs for WordPress-based site
- **Goal**: Reduce costs by 80%+ using free tier services

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons

### CMS & Backend
- **Supabase** (Backend-as-a-Service) - PRIMARY
- **PostgreSQL** database (500MB free forever)
- **Real-time subscriptions** and **Authentication**
- **File storage** and **REST API**
- **Strapi v5** (Legacy backup option)

### Hosting & Deployment
- **Vercel** for Next.js frontend (free forever)
- **Supabase** for backend services (free tier)
- **Custom domain** integration

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/             # About page and subpages
│   ├── admin/             # Admin dashboard with full CMS functionality
│   │   └── components/    # Admin form components with toast notifications
│   ├── blog/              # Blog listing and posts
│   ├── board/             # Board members page
│   ├── contact/           # Contact page
│   ├── donate/            # Donation page
│   ├── impact/            # Impact metrics page
│   ├── programs/          # Programs listing and details
│   ├── test-supabase/     # Database connectivity testing page
│   ├── volunteer/         # Volunteer page
│   └── components/        # Page-specific components
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
│   ├── supabase.ts        # Supabase client and API functions
│   └── cloudinary-client.ts # Cloudinary integration for image uploads
├── types/                 # TypeScript type definitions
├── public/                # Static assets
├── scripts/               # Database setup and utilities
└── adlai-strapi-cms/      # Strapi CMS setup (legacy)
```

## 🗃️ Database Structure (Supabase)

### Current Content Tables ✅
1. **Programs** - Foundation programs with **gallery support** (up to 5 images per program)
2. **Blog Posts** - News and updates with SEO fields and rich text content
3. **Board Members** - Leadership team with order management and biographies
4. **Testimonials** - Community feedback with featured status and rich text
5. **Impact Stats** - Metrics and achievements with custom icons
6. **Hero Slides** - Homepage hero carousel with dual call-to-action buttons
7. **Partners** - Partner organizations with logo carousel display
8. **Team Members** - Staff and team profiles with contact information
9. **Impact Timeline** - Milestone tracking with date-based ordering

### Enhanced Database Features ✅
- **Row Level Security (RLS)** - Public read access for published content
- **Gallery Management** - Multiple images per program with featured image selection
- **Rich Text Support** - WYSIWYG editor integration across all content types
- **Real-time subscriptions** - Live updates when content changes
- **TypeScript integration** - Auto-generated types from database schema
- **REST API** - Automatic API endpoints for all tables
- **Cloudinary Integration** - Professional image storage and optimization
- **Admin Interface** - Full CRUD operations with toast notifications

### Sample Data Included ✅
- 3 Sample programs with different categories
- 4 Impact statistics with real foundation metrics
- 3 Community testimonials
- 3 Board member profiles
- 2 Blog posts with content

## 🚀 Getting Started

### Prerequisites
- Node.js 18-22 (Next.js compatibility)
- npm or pnpm

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd adlai-heroes-foundation-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access Admin Dashboard**
   - Navigate to `http://localhost:3000/admin`
   - Full content management with toast notifications
   - Test database connectivity at `http://localhost:3000/test-supabase`

### Database Setup ✅ COMPLETED

**Supabase Integration Ready!**
- ✅ Database tables created
- ✅ Sample data inserted  
- ✅ Row Level Security configured
- ✅ API client configured

**To recreate database (if needed):**
1. Run SQL from `scripts/create-tables.sql` in Supabase SQL Editor
2. Run SQL from `scripts/hero-slides-partners-schema.sql` in Supabase SQL Editor (for hero slides and partners)
3. Run SQL from `scripts/update-hero-slides-two-buttons.sql` in Supabase SQL Editor (for dual button support)
4. Run SQL from `scripts/team-members-schema.sql` in Supabase SQL Editor (for team management)
5. Run `SUPABASE_SERVICE_ROLE_KEY=your-key node scripts/insert-remaining-data.js`

## 🛠 Admin Dashboard Features ✅ COMPLETED

### Content Management System
- **Full CRUD Operations** - Create, Read, Update, Delete all content types
- **WYSIWYG Editor** - Custom rich text editor with toolbar and preview (React 19 compatible)
- **Gallery Management** - Upload up to 5 images per program with drag & drop
- **Featured Image Selection** - Choose featured image from uploaded gallery
- **Toast Notifications** - Professional feedback for all operations
- **Real-time Updates** - Changes reflect immediately on the website
- **Responsive Modal Design** - Wide forms on desktop, adaptive on mobile
- **Form Validation** - Comprehensive input validation and error handling
- **Error Boundaries** - Graceful error handling to prevent dashboard crashes

### Admin Interface Components
1. **Hero Slides Management** - Homepage carousel with dual buttons and advanced styling
2. **Program Management** - Create/edit programs with **3-tab interface**: Content, Gallery, SEO
3. **Impact Stats Management** - Custom metrics with icon selection
4. **Testimonial Management** - Community feedback with WYSIWYG editor
5. **Blog Post Management** - Full blog CMS with WYSIWYG, SEO fields and content tabs
6. **Board Member Management** - Team profiles with photo uploads, WYSIWYG biographies, and ordering
7. **Partners Management** - Partner organizations with logo uploads and website links
8. **Team Members Management** - Staff profiles with contact info and social links
9. **Content Section Management** - Dynamic page sections across all pages
10. **Page Management** - Meta tags and SEO settings for core pages
11. **Impact Timeline Management** - Milestone tracking with date-based ordering

### Enhanced User Experience Features ✅
- **Custom WYSIWYG Editor** - Markdown-style editor with toolbar (Bold, Italic, Headers, Lists, Links, Quotes)
- **Preview Mode** - Real-time preview of formatted content
- **Gallery Upload & Management** - Drag & drop multiple images with reordering
- **Cloudinary Integration** - Professional image storage with optimization
- **Tabbed Form Interface** - Content, Gallery, and SEO tabs for organized input
- **Auto-slug Generation** - URL-friendly slugs generated from titles
- **Toast Notifications** - Loading states, success messages, error feedback
- **Modal Responsiveness** - Proper sizing across all screen sizes
- **Order Management** - Display order controls for all content types
- **Publish/Draft Status** - Control content visibility

### Admin Dashboard Routes
- `/admin` - Main dashboard with content overview and management
- `/admin/test-supabase` - Database connectivity testing and diagnostics

## 🌍 Environment Variables

### Current Configuration ✅
```env
# Supabase Configuration (PRIMARY)
NEXT_PUBLIC_SUPABASE_URL=https://suwgdnjyzdqjyanlpqdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudinary Configuration (Image Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=adlai_preset
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Adlai Heroes Foundation

# Legacy Strapi (Backup)
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
```

## 🎨 Brand Colors Integration

### Brand Palette
- **adlaiBlue**: #20B2F6 - Used for mission, health programs, and primary elements
- **adlaiGreen**: #BFD836 - Used for empowerment programs and volunteer CTAs
- **adlaiPink**: #E92A8F - Used for vision, community programs, and donate buttons
- **adlaiOrange**: #F69731 - Used for education programs and accent elements

### Color Implementation
- **Impact Stats**: Cycling brand colors with subtle backgrounds and accent borders
- **Program Categories**: Color-coded by type with consistent mapping across all pages
- **Mission & Vision**: Gradient backgrounds with brand color themes
- **Buttons**: Contextual brand colors (donate=pink, volunteer=green, learn more=blue)
- **Footer**: Brand gradient from blue through pink to orange
- **Hero Slider**: Primary button (pink) and secondary button (blue) styling

### Design System
- Consistent color usage across all components
- Accessibility-compliant contrast ratios
- Hover effects and transitions with brand colors
- Category-based color mapping for programs and content

## 📊 Performance & SEO

### Current Metrics
- ⚡ **Performance**: Target 90+ Lighthouse score
- 🔍 **SEO**: Target 100 Lighthouse score
- ♿ **Accessibility**: Target 95+ Lighthouse score
- 💚 **Best Practices**: Target 100 Lighthouse score

### Optimization Features
- ✅ Next.js Image optimization
- ✅ Dynamic imports and code splitting
- ✅ Static generation (SSG) where possible
- ✅ Incremental Static Regeneration (ISR)
- ✅ Proper meta tags and Open Graph
- ✅ Schema.org structured data

## 🔒 Security & Best Practices

### Implemented Security Measures
- ✅ Environment variable protection
- ✅ Content sanitization from CMS
- ✅ Proper error handling and fallbacks
- ✅ TypeScript for type safety
- ✅ Input validation and CSRF protection

## 💰 Cost Breakdown

### Monthly Costs (Target)
- **Vercel Hosting**: $0 (Hobby plan)
- **Railway/Render**: $0 (Free tier)
- **Domain**: ~$12/year
- **Cloudinary**: $0 (Free tier)
- **Total**: ~$1/month (vs $50+/month WordPress hosting)

## 🚀 Deployment

### Production Deployment

1. **Deploy Strapi to Railway/Render**
   ```bash
   # Follow Railway/Render deployment guide
   # Set production environment variables
   ```

2. **Deploy Next.js to Vercel**
   ```bash
   vercel --prod
   ```

3. **Configure domain**
   - Add custom domain in Vercel dashboard
   - Update DNS records

### Environment Variables (Production)
Set the following in Vercel dashboard:
- `STRAPI_API_URL`
- `STRAPI_API_TOKEN`
- `NEXT_PUBLIC_STRAPI_API_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_SITE_URL`

## 📝 Content Management

### CMS Workflow
1. **Access Strapi Admin**: `https://your-strapi-url/admin`
2. **Create/Edit Content**: Use rich text editor
3. **Upload Images**: Drag & drop with auto-optimization
4. **Publish**: Content appears immediately on website
5. **SEO**: Meta titles and descriptions per page

### Content Guidelines
- Use clear, engaging headlines
- Optimize images before upload
- Include alt text for accessibility
- Write meta descriptions (150-160 characters)
- Use proper heading hierarchy (H1 → H2 → H3)

## 🔧 Recent Technical Improvements ✅

### React 19 Compatibility Updates (August 2025)
**Challenge**: React-Quill library compatibility issues with React 19
**Error**: `p.default.findDOMNode is not a function`
**Solution**: Built custom WYSIWYG editor with Markdown-style formatting

#### Custom WYSIWYG Editor Features ✅
- **Toolbar Integration** - Bold, Italic, Underline, Headers (H1, H2), Lists, Links, Quotes
- **Live Preview** - Toggle between edit and preview modes
- **Markdown Support** - Uses standard Markdown syntax for formatting
- **React 19 Compatible** - No deprecated APIs, fully compatible with latest React
- **Error Boundaries** - Graceful error handling to prevent dashboard crashes
- **Responsive Design** - Works perfectly across all screen sizes

#### Gallery Management System ✅
- **Multi-Image Upload** - Support for up to 5 images per program
- **Drag & Drop Interface** - Intuitive image uploading experience
- **Image Reordering** - Drag to reorder gallery images
- **Featured Image Selection** - Select featured image from gallery
- **Cloudinary Integration** - Professional image storage and optimization
- **Upload Progress** - Visual feedback during image upload process

#### Performance Optimizations ✅
- **Removed React-Quill Dependencies** - Eliminated compatibility conflicts
- **Error Boundary Implementation** - Prevent admin dashboard crashes
- **Modal Responsiveness** - Improved form sizing (max-w-sm → max-w-7xl responsive)
- **TypeScript Integration** - Full type safety across all components
- **Build Optimization** - Clean builds with no compatibility warnings

## 🐛 Known Issues & Solutions

### Git Repository Safety ⚠️ CRITICAL
**Date**: August 1, 2025
**Issue**: All project files were lost during git rebase operation
**Cause**: Used `git pull --rebase` and `git reset --hard` without proper backup
**Resolution**: Recovered files from `git reflog` at commit `0c228e9`

#### Prevention Measures (MANDATORY)
1. **NEVER use destructive git commands** without backup
2. **ALWAYS stash changes** before pull/rebase: `git stash push -m "backup"`
3. **ALWAYS verify files exist** after git operations using file explorer
4. **ALWAYS check git log** before destructive operations: `git log --oneline -5`
5. **Use git reflog for recovery**: `git reflog` to find lost commits

#### Quick Recovery Commands
```bash
git reflog                    # Find lost commits
git checkout <lost-commit>    # Recover files
git checkout main            # Return to main branch  
git cherry-pick <commit>     # Apply recovered changes
```

### Current Debugging Efforts (August 2025)
**Issue**: Program form submissions not providing feedback
**Status**: Under investigation with enhanced logging
**Debug Features Added**:
- Console logging for form submission process
- Validation checks for required fields
- Error tracking in try/catch blocks
- Loading state management verification

### Common Issues
1. **Build Errors**: Check TypeScript and ESLint
2. **CMS Connection**: Verify API URL and token
3. **Image Loading**: Check Cloudinary configuration
4. **Performance**: Monitor Core Web Vitals
5. **Lost Files**: Follow Git Recovery Commands above
6. **Form Submissions**: Check browser console for debug messages

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes following TypeScript standards
3. Test locally with `npm run build`
4. Submit pull request

### Code Standards
- Use TypeScript for all new code
- Follow existing component patterns
- Implement proper error handling
- Add proper TypeScript interfaces
- Test responsive design

## 📞 Support

For technical support or questions about the website:
- **Email**: tech@adlaiheroesfoundation.org
- **Documentation**: Check this README first
- **Issues**: Create GitHub issue for bugs

## 📄 License

This project is proprietary to Adlai Heroes Foundation.

---

## 📋 Project Status & Changelog

### Version 3.0.0 (August 8, 2025) - Current
**Status**: Production Ready with Enhanced Admin System
**Major Features Completed**:
- ✅ Custom React 19-compatible WYSIWYG editor
- ✅ Advanced gallery management system (5 images per program)
- ✅ Featured image selection from gallery
- ✅ Modal responsiveness improvements 
- ✅ Error boundary implementation
- ✅ Comprehensive debugging system
- ✅ All CRUD forms enhanced with WYSIWYG
- 🔄 Form submission debugging in progress

### Version 2.4.0 (August 3, 2025)
**Status**: Complete CMS with Brand Color Integration & Enhanced UI
**Features**: Full admin dashboard, brand colors, responsive design

### Version 2.0.0 (August 1, 2025)  
**Status**: Initial CMS Implementation
**Features**: Basic CRUD operations, Supabase integration

---

**Last Updated**: August 8, 2025
**Current Version**: 3.0.0
**Status**: Production Ready - Enhanced Admin System with Gallery Management & Custom WYSIWYG Editor