# DebtFlow Project Context

## Project Overview

**DebtFlow** is an AI-powered debt optimization and financial freedom platform built with Next.js 16 (App Router) and Supabase. The platform helps users strategically pay down debts using data-driven algorithms and personalized repayment strategies.

### Tech Stack
- **Frontend**: Next.js 16.1.6 (App Router), React 19.2.3, TypeScript 5
- **Backend/Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: OTP-based email authentication via Supabase Auth
- **Styling**: CSS Modules with CSS custom properties (dark theme)
- **Deployment**: Vercel (production), Cloudflare Tunnel (local preview)

### Architecture
- **App Router** (`src/app/`): Server components for pages, route handlers under `/api`
- **Supabase Integration**: Dual client setup—authenticated users get full access, anonymous users get read-only demo data
- **Database Schema**: Three main tables—`profiles`, `projects`, `project_updates`—with RLS policies

## Project Structure

```
debt-flow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/auth/           # Auth route handlers (request-otp, verify-otp, signout)
│   │   ├── dashboard/          # Dashboard page (supports auth + demo mode)
│   │   ├── globals.css         # Global styles + CSS variables
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page with OTP sign-in form
│   │   └── page.module.css     # Landing page styles
│   ├── components/
│   │   └── auth/
│   │       ├── otp-form.tsx    # Client-side OTP form component
│   │       └── otp-form.module.css
│   ├── lib/
│   │   └── supabase/
│   │       ├── server.ts       # Async server-side Supabase client factory
│   │       └── browser.ts      # Browser-side Supabase client
│   └── types/
│       └── database.ts         # TypeScript types for Supabase schema
├── supabase/
│   ├── migrations/
│   │   └── 20260312000000_init.sql  # Initial schema + RLS policies + triggers
│   ├── seed.sql                # Demo data for projects and project_updates
│   └── config.toml             # Supabase local config
├── docs/                       # Product blueprints and research docs
├── public/                     # Static assets
├── start_server.sh             # One-command local dev + Cloudflare tunnel
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── .env.example                # Template for environment variables
```

## Building and Running

### Prerequisites
- Node.js 20+
- Docker (for local Supabase)
- `cloudflared` (auto-installed by `start_server.sh`)

### Environment Setup
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for demo read access)

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server on `http://localhost:3000` |
| `npm run build` | Production build with type checking |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` for type checking |
| `npm run supabase:start` | Start local Supabase containers |
| `npm run supabase:stop` | Stop local Supabase containers |
| `npm run db:reset` | Reset local database (apply migrations + seed) |
| `npm run db:status` | Check Supabase local status |
| `./start_server.sh` | Start dev server + Cloudflare tunnel for public preview |

### Local Development Workflow
```bash
# Start Supabase (Docker required)
npm run supabase:start

# Start dev server
npm run dev

# Open http://localhost:3000
```

### One-Command Public Preview
```bash
chmod +x ./start_server.sh
./start_server.sh
# Prints a public trycloudflare.com URL for sharing
```

### Database Operations
```bash
# Apply migrations to local Supabase
npx supabase db push

# Generate TypeScript types from schema
npx supabase gen types typescript --local > src/types/database.ts

# Reset and seed local database
npm run db:reset
```

## Key Implementation Details

### Authentication Flow
1. User enters email on landing page (`src/app/page.tsx`)
2. `OtpForm` component calls `/api/auth/request-otp` to send OTP via Supabase
3. User enters 6-digit code, `OtpForm` calls `/api/auth/verify-otp`
4. On success, redirect to `/dashboard` with session cookies set

### Demo Mode Architecture
The dashboard (`src/app/dashboard/page.tsx`) supports two modes:
- **Authenticated**: Full Supabase client with user session
- **Anonymous/Demo**: Read-only client using `SUPABASE_SERVICE_ROLE_KEY` that queries only `is_demo = true` records

### Server-Side Supabase Access
The `createServerSupabaseClient()` helper in `src/lib/supabase/server.ts` is **async** and must be awaited:
```typescript
const supabase = await createServerSupabaseClient()
```

### Database Schema
- **`profiles`**: User profiles linked to `auth.users` via trigger
- **`projects`**: Debt/workspace projects with `owner_id`, `is_demo` flag, status enum
- **`project_updates`**: Activity feed entries with cascade delete

### Row Level Security (RLS)
- Authenticated users can read/write their own data
- Demo records (`is_demo = true`) are readable by authenticated users
- Service role key bypasses RLS for demo read client

## Development Conventions

### Code Style
- 2-space indentation
- TypeScript strict mode enabled
- App Router conventions (`page.tsx`, `layout.tsx`)
- CSS Modules for component-scoped styles (e.g., `otp-form.module.css`)

### File Naming
- Components: PascalCase (`OtpForm.tsx`)
- Pages: `page.tsx` in route folders
- Styles: `<name>.module.css` beside component
- Route styles: `page.module.css` beside route file

### Pre-Commit Checklist
```bash
npm run lint && npm run typecheck
```

### Commit Message Format
```
<scope>: <short description>
```
Examples:
- `supabase: add seed data`
- `auth: fix OTP verification edge case`
- `dashboard: add demo mode banner`

## Testing Guidelines

No automated test suite exists yet. Manual testing workflow:
1. Run `npm run dev`
2. Test anonymous `/dashboard` access (demo mode)
3. Test OTP sign-in flow end-to-end
4. Verify authenticated dashboard shows user-specific data

When adding tests, place them near the feature:
- `src/components/auth/otp-form.test.tsx`
- Use descriptive names: `OtpForm handles OTP verification`

## Deployment (Vercel)

### Environment Variables
Set these in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (production only, keep secret)

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Framework Preset**: Next.js (auto-detected)

### Post-Deploy Verification
1. Visit deployed URL, confirm landing page renders
2. Test OTP email delivery and sign-in flow
3. Check `/dashboard` loads seeded data without errors
4. Monitor Vercel logs for Supabase connection issues

## Security Notes

- Keep `.env.local` out of version control (gitignored)
- Rotate `SUPABASE_SERVICE_ROLE_KEY` if leaked; update `.env.local` and Vercel secrets
- Cloudflare tunnels are temporary and public—use for demos only, not production
- RLS policies protect data; service role key should only be used server-side

## Related Documentation

- `README.md`: Deployment guide and Supabase setup instructions
- `AGENTS.md`: Repository guidelines for coding style, testing, and PRs
- `docs/payitoff_blueprint_*.pdf`: Product blueprint analyzing Payitoff as reference
- `supabase/migrations/20260312000000_init.sql`: Full database schema with RLS policies
