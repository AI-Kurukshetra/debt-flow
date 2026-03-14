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

## Development Roadmap (PLAN_CC.md)

1. **Phase 0: Auth & Schema (✅ Complete)** - Custom auth (login/register/session), profiles, debt accounts, and core table migrations.
2. **Phase 1-2: Foundation & Profile** - Chart library setup (Recharts), middleware auth guards, and profile auto-create triggers.
3. **Phase 3: Tiered API Routes** - Servicers, Forgiveness, Accounts, Goals, Budget, Strategies, Refinancing, and Analytics.
4. **Phase 4: Dashboard Rewrite** - Implementing the polished dashboard with real/demo data modes.
5. **Phase 5: Frontend Modules** - Onboarding (3 steps), Strategies (comparison), Budgeting (charts), and Forgiveness (ECF tracking).
6. **Phase 6: Polish** - Toasts, loading states, error boundaries, mobile navigation, and "Upgrade Pro" upsells.

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
- `docs/`: Product blueprints, implementation plans (`PLAN_CC.md`), and UI mockups (`docs/images-v1/`).
- `docs/STITCH_PROMPT.md`: High-fidelity UI generation prompts for Google Stitch.
