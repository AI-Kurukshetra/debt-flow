# Revise DebtFlow Plan for the Current Starter-Pack App

## Summary
- Treat the current app as a starter pack, not a partially built DebtFlow product.
- Preserve what already works today:
  - Supabase Auth with OTP routes
  - landing page
  - demo dashboard backed by `projects` / `project_updates`
  - deployed Supabase schema and RLS additions
- Build the full product phase by phase on top of that starter pack, instead of following `docs/PLAN.md` literally as if the repo were empty.
- Do not replace auth, do not remove demo tables, and do not rebuild the app around custom password/session tables from the database doc.

## Revised Implementation Phases

### Phase 0: Stabilize the current baseline
- Keep the existing root UX and auth flow as the bootstrap entry to the product.
- Leave current demo routes and seed-backed dashboard intact until feature pages are ready.
- Avoid introducing custom auth endpoints from `docs/PLAN.md`; reuse the existing OTP flow in `src/app/api/auth/*`.
- Add a short README/plan alignment note describing the real current baseline:
  - starter pack UI
  - Supabase Auth
  - additive DebtFlow schema already migrated remotely

### Phase 1: Foundation alignment
- Normalize the app structure around the existing App Router layout rather than creating a separate frontend/backend mental model.
- Keep `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` as the only Supabase entrypoints.
- Add route groups for the real product surface without disturbing current pages:
  - `(marketing)` for starter/landing surfaces
  - `(app)` for authenticated product pages
- Add shared app shell primitives for the future product:
  - authenticated layout
  - nav/sidebar
  - section header
  - empty/loading/error states
- Keep fonts, globals, and styling system compatible with the current app; evolve it instead of replacing it wholesale.

### Phase 2: Profile and onboarding first
- Extend the current authenticated experience to use the richer `profiles` table fields already added in Supabase.
- Build the first real app flow as onboarding/profile completion, because this now matches both the current auth setup and the new schema.
- Add an authenticated onboarding route that collects:
  - full name
  - username
  - phone
  - employment type
  - income
  - family size
  - timezone
- Update the `profiles` row for `auth.uid()` directly from server actions or route handlers.
- Define completion as: a signed-in user can land in onboarding, save profile data, and then enter the real app shell.

### Phase 3: Replace the starter dashboard with a real product dashboard
- Keep the current `/dashboard` route, but evolve it from demo `projects` data into a real DebtFlow dashboard.
- Dashboard should read from the new schema, in this order:
  - `profiles`
  - `debt_accounts`
  - active `payment_strategies`
  - upcoming `payment_schedules`
  - `user_goals`
  - latest `notifications`
- Preserve anonymous/demo behavior temporarily behind a separate fallback section until the authenticated dashboard is stable.
- Once authenticated dashboard cards are working, demote the old `projects` / `project_updates` UI to a demo-only block or remove it in a later cleanup phase.

### Phase 4: Core CRUD by dependency order
- Build features in dependency order against the schema already implemented:
  1. Accounts
     - create/list/update debt accounts
     - optional servicer selection from `loan_servicers`
  2. Transactions
     - append-only payment history tied to accounts
  3. Strategies
     - create and activate repayment strategies
  4. Payment schedules
     - list and manage upcoming scheduled payments
  5. Goals and budget
     - `user_goals`
     - `budget_categories`
  6. Forgiveness
     - browse `forgiveness_programs`
     - manage `user_forgiveness_tracking`
  7. Analytics extras
     - `credit_scores`
     - `refinancing_offers`
     - `tax_optimizations`
  8. Notifications and education
     - inbox from `notifications`
     - library from `educational_content`
- Use route handlers only where the browser needs a mutation endpoint.
- Prefer server components for reads on authenticated pages instead of forcing everything through `app/api`, since the repo is already using App Router and server-side Supabase clients.

### Phase 5: Route map and interfaces
- Keep current auth routes:
  - `/api/auth/request-otp`
  - `/api/auth/verify-otp`
  - `/api/auth/signout`
- Add product pages, not a parallel API-first skeleton from `docs/PLAN.md`:
  - `/onboarding`
  - `/dashboard`
  - `/accounts`
  - `/accounts/[id]`
  - `/strategies`
  - `/forgiveness`
  - `/budget`
  - `/notifications`
  - `/education`
  - `/settings/profile`
- Add route handlers only for mutations that need client submission:
  - `/api/profile`
  - `/api/accounts`
  - `/api/accounts/[id]`
  - `/api/transactions`
  - `/api/strategies`
  - `/api/strategies/[id]/activate`
  - `/api/goals`
  - `/api/budget`
  - `/api/forgiveness/tracking`
  - `/api/notifications/[id]/read`
- Ownership model stays `auth.uid()` -> `public.profiles.id`; do not introduce `users`, `user_sessions`, or `refresh_tokens`.

## Testing and Acceptance
- Baseline must continue to pass before each phase is considered complete:
  - `npm run build`
  - OTP sign-in still works
  - remote Supabase schema remains compatible
- Phase 2 acceptance:
  - signed-in user can create/update profile data
  - onboarding state is persisted in `profiles`
- Phase 3 acceptance:
  - authenticated dashboard renders live data from new DebtFlow tables
  - no dependency on starter `projects` data for core signed-in experience
- Phase 4 acceptance:
  - each feature page supports at least list/create/edit for its table group
  - RLS prevents cross-user access on all user-owned reads and writes
- Final acceptance:
  - the app no longer feels like a starter demo; it behaves like a real authenticated DebtFlow product
  - starter-pack demo artifacts are either isolated to marketing/demo mode or removed intentionally

## Assumptions
- The current implementation is the source of truth for auth and app framework, not the older guidance in `docs/PLAN.md`.
- `docs/PLAN.md` should be treated as generic sequencing advice, not as an exact build script for this repo.
- The already-implemented remote schema migration is correct and should now be consumed by the app rather than redesigned.
- The user wants phase-wise execution starting from the present starter pack, with minimal rework and no auth-model reset.
