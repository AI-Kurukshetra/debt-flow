# DebtFlow - Project Context

DebtFlow is an AI-powered debt optimization and financial freedom platform. It helps borrowers compare payoff strategies, track loan balances, and visualize their path toward financial freedom using a modern Next.js and Supabase stack.

## Technical Overview

- **Frontend:** Next.js 15+ (App Router) with React 19 and TypeScript.
- **Backend:** Supabase for Authentication (Custom Username/Password), Database (PostgreSQL), and Row Level Security (RLS).
- **Styling:** CSS Modules (Vanilla CSS approach) with global custom properties.
- **Architecture:** Hybrid Next.js model using both Server Components (direct DB access) and Client Components (API interaction).
- **Key Entities:**
  - `profiles`: User profiles with employment and income details.
  - `loan_servicers`: Master list of debt providers.
  - `debt_accounts`: Detailed debt information (balance, interest, type).
  - `payment_strategies`: Implementation of Snowball, Avalanche, and Custom payoff models.
  - `transactions`: History of payments, interest, and adjustments.
  - `forgiveness_programs`: Tracking for student loan forgiveness (PSLF, IDR).
  - `user_goals`: Milestones for debt freedom and financial stability.
  - `payment_schedules`: Future payment planning and autopay tracking.

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

## Development Roadmap (✅ Core Complete)

The initial implementation plan (`docs/PLAN_CC.md`) is successfully completed:

1. **Phase 0: Auth & Schema (✅ Complete)** - Custom auth, profiles, and core migrations.
2. **Phase 1-2: Foundation & Profile (✅ Complete)** - Chart library (Recharts), auth middleware, and profile triggers.
3. **Phase 3: Tiered API Routes (✅ Complete)** - 20+ API routes for all core entities.
4. **Phase 4: Dashboard Rewrite (✅ Complete)** - High-fidelity overview with real/demo data modes.
5. **Phase 5: Frontend Modules (✅ Complete)** - Onboarding, Strategies (DND), Budgeting, Forgiveness, and Payments.
6. **Phase 6: Polish (✅ Complete)** - Toasts, mobile navigation, loading skeletons, and error boundaries.

### Next Steps: Advanced Roadmap (`docs/PLAN_ADVANCED.md`)

1. **Phase 7: Production Readiness** - Security audit, RLS verification, and data validation.
2. **Phase 8: Automation & Notifications** - Cron-based reminders and rate drop monitoring.
3. **Phase 9: Plaid Integration** - Automated bank sync and transaction matching.
4. **Phase 10: AI Payoff Optimizer** - Advanced algorithmic payment splitting and natural language insights.

## Development Conventions

- **Supabase SSR:** Use `src/lib/supabase/server.ts` for server components/actions and `src/lib/supabase/client.ts` for client components.
- **Data Fetching:** Prefer Server Components for initial page data. Use Client Components for interactive forms and real-time chart updates.
- **Authentication:** Custom username/password flow with cookie-based session management. Middleware protects `/dashboard/*`.
- **Database Types:** Always run `npx supabase gen types typescript --local > src/types/database.ts` after schema changes.
- **RLS:** All tables have Row Level Security enabled. Policies strictly enforce `auth.uid() = user_id`.

## Project Structure

- `src/app/`: Next.js App Router (Pages & API Route Handlers).
- `src/components/`: Reusable UI components (Pre-fixed with `module.css`).
- `src/lib/supabase/`: Supabase client and server initialization logic.
- `supabase/migrations/`: SQL migration files for version-controlled schema changes.
- `docs/`: Implementation plans (`PLAN_CC.md`, `PLAN_ADVANCED.md`) and UI mockups (`docs/images-v1/`).
