# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DebtFlow** is an AI-powered debt optimization platform built with Next.js, Supabase, and Vercel. The app helps borrowers compare payoff strategies, track balances, and plan debt reduction. It supports both authenticated users and a public demo mode for anonymous visitors to explore the dashboard.

## Architecture

### Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Styling**: CSS Modules with CSS custom properties
- **Deployment**: Vercel

### Core Patterns

**Multi-tier Access Model**:
- Authenticated users: Use `createServerSupabaseClient()` (SSR-aware, cookie-based session)
- Anonymous/Demo users: Use service role key client for public demo data read-only access
- Demo data is marked with `is_demo=true` column; both authenticated and anonymous users can see demo data
- Separation is intentional—preserve when modifying dashboard queries or access behavior

**Supabase Client Initialization**:
- Server: `await createServerSupabaseClient()` in `src/lib/supabase/server.ts`—must be awaited
- Browser: `createClient()` in `src/lib/supabase/client.ts`
- Both use typed helpers from `src/types/database.ts` (auto-generated from schema)

**Route Structure**:
- `src/app/page.tsx`: Landing page with OTP signin form
- `src/app/dashboard/page.tsx`: Dual-mode dashboard (authenticated workspace or public demo)
- `src/app/api/auth/*`: Auth endpoints (request-otp, verify-otp, signout)
- `src/app/layout.tsx`: Root layout
- `src/components/auth/`: OTP form and related UI

**Database & Migrations**:
- Schema and seed data in `supabase/migrations/` and `supabase/seed.sql`
- Run migrations locally: `npm run db:reset` (Docker required)
- Generate updated types: `npx supabase gen types typescript --local > src/types/database.ts`

## Development Commands

### Core Commands
- `npm run dev`: Start Next.js dev server on `http://localhost:3000`
- `npm run build`: Production compile and type check
- `npm run lint`: ESLint validation
- `npm run typecheck`: `tsc --noEmit` static type check
- `./start_server.sh`: Start app + create temporary Cloudflare tunnel for public preview

### Supabase Commands
- `npm run supabase:start`: Start local Supabase containers (requires Docker)
- `npm run supabase:stop`: Stop local Supabase containers
- `npm run db:reset`: Apply migrations and seed local database
- `npm run db:status`: Check local Supabase status
- `supabase studio`: Open Supabase dashboard at `http://localhost:54322`

### Local Setup
1. Copy `.env.example` to `.env.local`, fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Run `npm run supabase:start` (Docker required)
3. Run `npm run db:reset` to apply migrations and seed data
4. Run `npm run dev` to start the dev server

**Note**: Supabase containers are only needed for auth, migrations, and database work. The homepage can be previewed without them.

## Code Style & Key Conventions

**TypeScript & File Naming**:
- Strict mode enabled; 2-space indentation
- Route files: `page.tsx`, `layout.tsx`, `route.ts`
- Components: `src/components/<feature>/<name>.tsx`
- Styles: `page.module.css` co-located with route files, `<name>.module.css` co-located with components
- Server-side async: Always `await createServerSupabaseClient()` in server components and route handlers

**Styling**:
- CSS Modules scoped per file
- Custom properties defined in `globals.css` for theme values
- Import styles to match file structure: `import styles from "./page.module.css"`

**Database Access**:
- Server-side: Await the Supabase helper: `const supabase = await createServerSupabaseClient()`
- Client-side: `createClient()` for browser-based queries
- Type queries using auto-generated `Database` type from `src/types/database.ts`

**Auth Flow**:
- OTP-based passwordless auth via `@supabase/supabase-js` and `@supabase/ssr`
- Endpoints validate OTP tokens, set secure session cookies, and redirect to dashboard
- Signout clears session and redirects to home

## Testing

No automated test suite yet. Validate manually using:
- `npm run dev` + `http://localhost:3000` for UI testing
- Anonymous `/dashboard` access for demo mode
- Authenticated login/logout flows via OTP
- Database queries via Supabase Studio at `http://localhost:54322`

When adding tests, co-locate them with the feature: `src/components/auth/otp-form.test.tsx`.

## Deployment

**Pre-deployment Checklist**:
1. Link repo to Supabase: `npx supabase link --project-ref <ref>`
2. Verify `.env.local` has required keys
3. Run `npm run db:reset` and `npm run lint`/`typecheck` locally
4. Commit and push changes

**Vercel Setup**:
1. Import repo through Vercel dashboard (detects Next.js automatically)
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (only if backend tasks need it)
3. Build command: `npm run build`
4. Output directory: `.next` (default)

**Post-deployment**:
- Verify OTP auth flow works (check email for auth link)
- Confirm `/dashboard` renders without errors with seeded data
- Check Supabase connection via `NEXT_PUBLIC_SUPABASE_*` env values

## Environment Variables

**Required** (add to `.env.local` for dev, Vercel secrets for prod):
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon public key (safe for client)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (server-side only, for demo read access)

Keep `.env.local` out of version control; use `.env.example` as template.

## Key Files

- `src/app/dashboard/page.tsx`: Auth + demo mode logic; demonstrates dual-client pattern
- `src/lib/supabase/server.ts`: Server-side SSR-aware helper (async)
- `src/lib/supabase/client.ts`: Client-side browser helper
- `src/components/auth/otp-form.tsx`: OTP form UI and validation
- `src/app/api/auth/*`: Route handlers for OTP flow
- `src/types/database.ts`: Auto-generated Supabase types (update after schema changes)
- `supabase/migrations/`: SQL schema files (apply via `db:reset`)
- `supabase/seed.sql`: Demo data
