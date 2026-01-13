# Aman Akshar Website - Deployment Guide

## Prerequisites

- Node.js 18+
- Docker Desktop (for local PostgreSQL)
- npm or pnpm

## Local Development

### 1. Start Database

```bash
docker compose up -d
```

### 2. Setup Environment

Create `.env` file with:

```env
DATABASE_URL="postgresql://amanakshar:amanakshar_dev@localhost:5432/amanakshar"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password"
```

### 3. Initialize Database

```bash
npm run db:push
npm run db:seed
```

### 4. Start Dev Server

```bash
npm run dev
```

## Production Deployment (Vercel)

### 1. Create PostgreSQL Database

Options:
- Supabase (recommended)
- Neon
- Railway
- PlanetScale (with adapter)

### 2. Set Environment Variables

In Vercel dashboard:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.com
ADMIN_USERNAME=<secure-username>
ADMIN_PASSWORD=<secure-password>
```

### 3. Deploy

```bash
vercel
```

Or connect GitHub repo for auto-deploy.

## Post-Deployment

### 1. Run Database Migration

```bash
npx prisma db push
```

### 2. Seed Initial Data

```bash
npm run db:seed
```

### 3. Create Admin User

Admin is created during seed. Change password in environment variables.

## Features Checklist

- [ ] Homepage loads with grain texture
- [ ] Hindi fonts render correctly
- [ ] Poems listing and filtering works
- [ ] Single poem page with first-letter effect
- [ ] Performances with YouTube embeds
- [ ] Books listing
- [ ] Theme (Bhav) pages
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Line share image generation
- [ ] Kavya Sammelan mode
- [ ] Search functionality
- [ ] Print styles work
- [ ] Mobile responsive

## Security Notes

1. Change default admin credentials
2. Enable rate limiting (already configured)
3. Review CORS settings if using custom domain
4. Keep NextAuth secret secure
5. Regular database backups

## Performance Tips

1. Images are optimized via Next.js Image component
2. Fonts are loaded via next/font (subset)
3. Code splitting is automatic
4. Enable Vercel Edge caching

## Support

For issues, contact: info@amanakshar.com

