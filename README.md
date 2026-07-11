# TrendsMix

Original fiction magazine — horror, mystery, romance, fantasy, sci-fi, and drama. Built with Next.js 16, Tailwind CSS 4, and TypeScript.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Fonts:** Geist Sans, Geist Mono, Instrument Serif (Google Fonts)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Editor:** TipTap (rich text)
- **Deployment:** Vercel

## Project Structure

```
trendsmix/
├── app/                     # Next.js App Router pages and routes
│   ├── layout.tsx           # Root layout (fonts, metadata, header/footer)
│   ├── page.tsx             # Home page
│   ├── stories/             # Stories listing and detail pages
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── privacy/             # Privacy Policy
│   ├── terms/               # Terms of Service
│   ├── cookies/             # Cookie Policy
│   ├── disclaimer/          # Disclaimer
│   ├── editorial-policy/    # Editorial Policy
│   ├── ai-policy/           # AI Content Policy
│   ├── dmca/                # DMCA Policy
│   ├── robots.ts            # Dynamic robots.txt
│   ├── sitemap.ts           # Dynamic sitemap.xml
│   ├── manifest.ts          # PWA manifest
│   ├── icon.tsx             # Favicon (generated)
│   ├── apple-icon.tsx       # Apple Touch Icon (generated)
│   ├── opengraph-image.tsx  # Default OG image (generated)
│   ├── twitter-image.tsx    # Default Twitter card (generated)
│   ├── loading.tsx          # Global loading skeleton
│   ├── error.tsx            # Error boundary
│   └── not-found.tsx        # Custom 404
├── components/
│   ├── brand/               # LogoMark, OG mark for image generation
│   ├── home/                # Hero, FeaturedStory
│   ├── layout/              # Header, Footer, MobileMenu, SkipLink, LegalPageLayout
│   ├── seo/                 # JsonLd component
│   ├── shared/              # Newsletter, ReadingTimeBadge, CategoryBadge
│   └── stories/             # StoryCard, StoryGrid, SearchBar, Pagination, etc.
├── lib/
│   ├── content.ts           # Content data layer (reads from Supabase)
│   ├── stories.ts           # Re-export layer (backward compatibility)
│   ├── seo.ts               # Metadata helpers, JSON-LD generators
│   ├── constants.ts         # Site name, description, nav links
│   └── utils.ts             # Category gradients, date formatting, cn()
├── types/
│   ├── story.ts             # Story, Author, FeaturedImage interfaces
│   └── database.ts          # Database table types
├── supabase/
│   └── schema.sql           # Full database schema
├── app/
│   └── admin/               # Admin dashboard (protected)
│       ├── layout.tsx        # Admin layout with sidebar
│       ├── page.tsx          # Dashboard
│       ├── login/            # Auth login
│       ├── posts/            # Posts CRUD + TipTap editor
│       ├── categories/       # Categories CRUD
│       ├── pages/            # Editable site pages
│       ├── media/            # Media library
│       ├── settings/         # Site settings
│       └── users/            # User management
├── supabase/
│   └── schema.sql           # Database schema (run in Supabase SQL Editor)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── tailwind.css             # Tailwind entry point (if applicable)
└── package.json
```

## Prerequisites

- **Node.js** 18.18 or later
- **npm** 9 or later (or pnpm/yarn)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/trendsmix.git
cd trendsmix
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your values:

```env
NEXT_PUBLIC_SITE_URL=https://www.trendsmix.online
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Get these values from your Supabase Dashboard → Settings → API.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start development server           |
| `npm run build` | Create optimized production build  |
| `npm start`     | Serve production build locally     |
| `npm run lint`  | Run ESLint                         |

## Production Build

```bash
npm run build
```

This generates a fully static/SSG output with all pages pre-rendered at build time. The build will fail if TypeScript or ESLint errors are present.

To preview the production build locally:

```bash
npm run build && npm start
```

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the contents of `supabase/schema.sql`
3. Create a **Storage bucket** named `media` with public access
4. Create your admin user via **Authentication → Users → Add User**
5. Promote the user to admin:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```
6. Copy your project URL and anon key from **Settings → API**

## Admin Dashboard

Access the admin dashboard at `/admin`. Features:

- **Dashboard** — stats overview, recent posts
- **Posts** — create, edit, delete, search, filter, draft/publish toggle, featured toggle, slug editor, reading time, TipTap rich text editor
- **Categories** — full CRUD
- **Pages** — edit About, Contact, Privacy, Terms, Cookies, DMCA, AI Policy, Editorial Policy, Disclaimer
- **Media Library** — upload images, delete, copy URL
- **Settings** — site name, logo, social links, AdSense/Analytics IDs
- **Users** — admin/editor role management
- **SEO** — per-post meta title, description, canonical URL, OG image (in post editor)

## SEO

The site includes production-grade SEO out of the box:

- **Metadata API** — global and per-page metadata via `lib/seo.ts`
- **Open Graph** — dynamic OG images for the site and each story
- **Twitter Cards** — `summary_large_image` cards with custom images
- **JSON-LD** — WebSite and Article structured data
- **Canonical URLs** — set per page with `alternates.canonical`
- **robots.txt** — generated dynamically via `app/robots.ts`
- **sitemap.xml** — generated dynamically via `app/sitemap.ts`
- **manifest.webmanifest** — PWA manifest via `app/manifest.ts`
- **Favicon + Apple Touch Icon** — generated at build time via `ImageResponse`

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trendsmix.git
git push -u origin main
```

### 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your `trendsmix` repository.
3. Framework preset: **Next.js** (auto-detected).
4. Click **Deploy**.

Add environment variables in the Vercel dashboard under **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` — your domain (defaults to `https://www.trendsmix.online`)
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key

### 3. Custom Domain

1. In the Vercel project dashboard, go to **Settings → Domains**.
2. Add your domain (e.g. `www.trendsmix.online`).
3. Configure DNS at your registrar:
   - **A record:** `76.76.21.21`
   - **CNAME** (for `www`): `cname.vercel-dns.com`
4. Vercel provisions an SSL certificate automatically.

## License

All rights reserved. Story content is original fiction owned by TrendsMix.
