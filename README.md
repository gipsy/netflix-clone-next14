# Netflix Clone

Educational full-stack demo that recreates a Netflix-style browsing experience: browse movies and TV shows by category, watch trailer modals (YouTube embeds), and maintain a personal watchlist after signing in.

**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL, NextAuth.js (Google, GitHub, email magic links).

> Learning project only—not affiliated with Netflix. Media metadata and posters are sample content for the UI.

**Live demo:** [netflix-clone-next14.vercel.app](https://netflix-clone-next14.vercel.app)

## Features

- OAuth and email sign-in (Google, GitHub, SMTP magic links)
- Proxy-protected `/home` routes (`proxy.ts` + NextAuth)
- Movie and show catalogs by category
- Hero video section and trailer modal
- Per-user watchlist (Server Actions)
- `/seed` (development only) to load sample titles

## Prerequisites

- Node.js 20+
- PostgreSQL on **[Supabase](https://supabase.com)** (see [docs/SUPABASE-RESTORE.md](./docs/SUPABASE-RESTORE.md) if the database was restored from a dashboard backup)
- OAuth and/or SMTP credentials as needed

## Setup

1. Copy `.env.example` to `.env.local` (or pull from Vercel: `vercel env pull .env.local -p netflix-clone-next14`).

2. Set at least:

   - `DATABASE_URL`
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
   - Provider keys (`GITHUB_*`, `GOOGLE_*`, email vars) for the sign-in methods you enable

3. Install and prepare the database:

```bash
npm install
npx prisma db push
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server ([localhost:3000](http://localhost:3000)) |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint (`eslint.config.mjs`) |

Unauthenticated users hitting `/` are sent to `/login`; after sign-in they go to `/home`.

## Deploy on Vercel

Connect the GitHub repo, set env vars to match `.env.example`, and deploy. Production hides `/seed`.

## References

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
