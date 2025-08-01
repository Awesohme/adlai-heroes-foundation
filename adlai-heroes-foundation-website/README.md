# Adlai Heroes Foundation Website

A modern, cost-effective website for the Adlai Heroes Foundation nonprofit organization, built with Next.js 15 and Strapi CMS.

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
- **Strapi v5** (Headless CMS)
- **PostgreSQL** database (free tier)
- **Cloudinary** for image optimization (free tier)

### Hosting & Deployment
- **Vercel** for Next.js frontend (free)
- **Railway/Render** for Strapi backend (free tier)
- **Custom domain** integration

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/             # About page and subpages
│   ├── blog/              # Blog listing and posts
│   ├── board/             # Board members page
│   ├── contact/           # Contact page
│   ├── donate/            # Donation page
│   ├── impact/            # Impact metrics page
│   ├── programs/          # Programs listing and details
│   ├── volunteer/         # Volunteer page
│   └── components/        # Page-specific components
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── adlai-strapi-cms/      # Strapi CMS setup
```

## 🗃️ Content Types (Strapi)

### Core Content Models
1. **Pages** - Dynamic page content
2. **Programs** - Foundation programs (Pad Up, Teen Fever, etc.)
3. **Blog Posts** - News and updates
4. **Board Members** - Leadership team
5. **Testimonials** - Community feedback
6. **Impact Stats** - Metrics and achievements

### Content Fields
- Rich text editors for content
- Image uploads with optimization
- SEO meta fields
- Publish/draft status
- Scheduling capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18-22 (Strapi compatibility)
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

### Strapi CMS Setup

1. **Install Strapi CLI**
   ```bash
   npm install -g @strapi/strapi@5.20.0
   ```

2. **Create Strapi project** (if needed)
   ```bash
   npx create-strapi-app@latest adlai-strapi-cms --quickstart
   ```

3. **Configure content types**
   - Follow the content model setup guide
   - Import provided content type schemas

## 🌍 Environment Variables

### Required Variables
```env
# Strapi API Configuration
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# Image Optimization
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

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

## 🐛 Known Issues & Solutions

### Common Issues
1. **Build Errors**: Check TypeScript and ESLint
2. **CMS Connection**: Verify API URL and token
3. **Image Loading**: Check Cloudinary configuration
4. **Performance**: Monitor Core Web Vitals

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

**Last Updated**: August 2025
**Version**: 2.0.0
**Status**: In Development - Strapi Integration Phase