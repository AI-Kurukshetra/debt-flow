# DebtFlow - Project Context

DebtFlow is an AI-powered debt optimization and financial freedom platform. It helps borrowers compare payoff strategies, track loan balances, and visualize their path toward financial freedom using a modern Next.js and Supabase stack.

## Technical Overview

- **Frontend:** Next.js 15+ (App Router) with React 19 and TypeScript.
- **Backend:** Supabase for Authentication (OTP-based), Database (PostgreSQL), and Row Level Security (RLS).
- **Styling:** CSS Modules (Vanilla CSS approach).
- **Architecture:** Hybrid Next.js model using both Server Components (direct DB access) and Client Components (API interaction).
- **Key Entities:**
  - `profiles`: User profiles with employment and income details.
  - `loan_servicers`: Master list of debt providers.
  - `debt_accounts`: Detailed debt information (balance, interest, type).
  - `payment_strategies`: Implementation of Snowball, Avalanche, and Custom payoff models.
  - `transactions`: History of payments, interest, and adjustments.
  - `forgiveness_programs`: Tracking for student loan forgiveness (PSLF, IDR).
  - `user_goals`: Milestones for debt freedom and financial stability.

## Building and Running

### Prerequisites
- Docker (for local Supabase development).
- Node.js & npm.
- Supabase CLI (`npx supabase`).

### Local Development
1. **Environment Setup:**
   - Copy `.env.example` to `.env.local` and configure your Supabase credentials.
2. **Start Supabase:**
   ```bash
   npm run supabase:start
   ```
3. **Database Reset (Migrations & Seed):**
   ```bash
   npm run db:reset
   ```
4. **Run Next.js:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Key Scripts
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.
- `npm run typecheck`: Run TypeScript compiler check.
- `npm run supabase:stop`: Stop local Supabase containers.
- `./start_server.sh`: Launches the server and creates a public Cloudflare tunnel.

## Development Roadmap (PLAN.md)

1. **Phase 1: Foundation** - Supabase client, environment config, and type generation.
2. **Phase 2: Auth API Routes** - Request/Verify OTP, Sign Out.
3. **Phase 3: Core API Routes** - Servicers, Forgiveness, Accounts, Goals, Budget, Notifications.
4. **Phase 4: Middleware** - Auth guards for `/dashboard/*`.
5. **Phase 5: Frontend Pages** - Onboarding, Dashboard, Strategies, Refinancing, etc.
6. **Phase 6: Polish** - Loading states, error boundaries, and responsiveness.

## Development Conventions

- **Supabase SSR:** Use `src/lib/supabase/server.ts` for server components/actions and `src/lib/supabase/client.ts` for client components.
- **Data Fetching:** Prefer Server Components for initial page data (direct Supabase calls). Use Client Components (`'use client'`) for interactive forms and real-time updates.
- **Authentication:** Email-based OTP is the primary flow. Use `middleware.ts` to protect private routes.
- **Database Types:** Always run `npx supabase gen types typescript --local > src/types/database.ts` after schema changes.
- **RLS:** All tables have Row Level Security enabled. Policies strictly enforce `auth.uid() = user_id`.

## Project Structure

- `src/app/`: Next.js App Router (Pages & API Route Handlers).
- `src/components/`: Reusable UI components (Pre-fixed with `module.css`).
- `src/lib/supabase/`: Supabase client and server initialization logic.
- `supabase/migrations/`: SQL migration files for version-controlled schema changes.
- `docs/`: Product blueprints (`payitoff_blueprint.pdf`) and implementation plans (`PLAN.md`).
