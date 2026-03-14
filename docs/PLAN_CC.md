# DebtFlow: Revised Implementation Plan

**Context**: Move the DebtFlow app from a Next.js starter pack state to a working debt optimization platform, implementing docs/PLAN.md phase by phase while preserving current working pieces (OTP auth, CSS Modules, Supabase helpers, typed schema).

---

## Gap Analysis Summary

| Area | Plan.md Requires | Current State | Action |
|---|---|---|---|
| Styling | Tailwind | CSS Modules | Keep CSS Modules — no migration |
| Auth | register/login/logout/refresh routes | OTP (request-otp, verify-otp, signout) | OTP covers both — keep as-is |
| Middleware | Auth guard on /dashboard/* | None | **Create** |
| Dashboard data | Real debt_accounts + strategies | projects/project_updates demo data | **Rewrite** |
| Domain API routes | ~15 route groups | None | **Create all** |
| Domain pages | /onboarding + 6 dashboard pages | None | **Create all** |
| Profile trigger | Auto-create profile on signup | Missing | **Add migration** |
| Shared UI | Nav, toasts, loading, error boundary | None | **Create** |
| Starter pack artifacts | N/A | file/globe/next/vercel SVGs, "Deploy to Vercel" CTA | **Remove** |

---

## Files to Modify

- `src/app/page.tsx` — remove "Deploy to Vercel" CTA, replace with "View Demo Dashboard"
- `src/app/dashboard/page.tsx` — rewrite to query debt_accounts + payment_strategies (not projects)
- `src/app/dashboard/page.module.css` — replace project card styles with summary strip + progress bar styles
- `src/app/layout.tsx` — wrap children with ToastProvider (Phase 6)

## Files to Create

### Phase 1 — Foundation Cleanup
- `src/middleware.ts` — Supabase SSR session refresh + /dashboard/* auth guard
- `src/app/dashboard/layout.tsx` — persistent sidebar nav for all dashboard routes
- `src/app/dashboard/layout.module.css` — sidebar + content column layout
- `src/components/ui/nav-link.tsx` — active-state-aware link using `usePathname()`
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

### Phase 2 — Auth Consolidation
- `supabase/migrations/20260315000000_profile_trigger.sql` — trigger to auto-insert profiles row on auth.users insert (onboarding_step=0)
- `src/app/api/auth/callback/route.ts` — code exchange for magic links (future-proofing)
- `src/app/api/profile/route.ts` — GET + PATCH for user profile (name, employment, income, onboarding_step)

### Phase 3 — Core API Routes (by FK tier)

**Tier 1 — Reference data (no user FK)**
- `src/app/api/servicers/route.ts` — GET loan_servicers (public, no auth)
- `src/app/api/forgiveness-programs/route.ts` — GET forgiveness_programs (public, no auth)

**Tier 2 — User root tables**
- `src/app/api/accounts/route.ts` — GET + POST debt_accounts
- `src/app/api/accounts/[id]/route.ts` — PATCH + DELETE single account
- `src/app/api/goals/route.ts` — GET + POST user_goals
- `src/app/api/budget/route.ts` — GET + POST budget_categories
- `src/app/api/notifications/route.ts` — GET notifications; PATCH /[id] to mark read

**Tier 3 — Depend on debt_accounts**
- `src/app/api/transactions/route.ts` — GET + POST transactions
- `src/app/api/strategies/route.ts` — GET + POST payment_strategies
- `src/app/api/strategies/[id]/route.ts` — PATCH + DELETE single strategy
- `src/app/api/schedules/route.ts` — GET + POST payment_schedules
- `src/app/api/refinancing/route.ts` — GET + POST refinancing_offers
- `src/app/api/credit-scores/route.ts` — GET + POST credit_scores

**Tier 4 — Cross-table aggregates**
- `src/app/api/forgiveness/tracking/route.ts` — GET + POST user_forgiveness_tracking
- `src/app/api/tax/route.ts` — GET + POST tax_optimizations
- `src/app/api/analytics/route.ts` — GET aggregate stats (total debt, monthly payment, projected payoff)

### Phase 5 — Frontend Pages
- `src/app/onboarding/page.tsx` + `page.module.css` — multi-step form (name → add account → choose strategy → done)
- `src/components/onboarding/step-indicator.tsx` — step 1 of 3 progress UI
- `src/app/dashboard/accounts/page.tsx` — list all debt_accounts
- `src/app/dashboard/accounts/new/page.tsx` — create account form
- `src/app/dashboard/accounts/[id]/page.tsx` — account detail + transaction history
- `src/components/accounts/account-form.tsx` — shared client form component
- `src/app/dashboard/strategies/page.tsx` — active strategy + avalanche vs snowball comparison
- `src/components/strategies/strategy-selector.tsx` — strategy type radio group
- `src/app/dashboard/budget/page.tsx` — budget_categories with allocated vs actual
- `src/app/dashboard/forgiveness/page.tsx` — programs + user tracking rows
- `src/components/forgiveness/program-card.tsx`
- `src/app/dashboard/refinancing/page.tsx` — refinancing offers list + add form
- `src/app/dashboard/settings/page.tsx` — profile edit + sign out

### Phase 6 — Polish
- `src/components/ui/toast.tsx` + `toast-provider.tsx` — context-based toast notifications
- `src/components/ui/loading-spinner.tsx`
- `src/app/dashboard/error.tsx` — dashboard error boundary
- `src/app/dashboard/loading.tsx` — dashboard skeleton loading UI

---

## Key Patterns to Reuse

- **Server Supabase client**: `await createServerSupabaseClient()` from `src/lib/supabase/server.ts` — replicate cookie wiring in `src/middleware.ts`
- **API route shape**: Follow `src/app/api/auth/request-otp/route.ts` — `NextResponse.json({ data } | { error })`, always check auth first
- **Types**: All table access imports `Database` from `src/types/database.ts` — use `Database["public"]["Tables"]["debt_accounts"]["Row"]` etc.
- **CSS Modules**: All new pages co-locate `page.module.css`; components co-locate `<name>.module.css`. CSS custom properties from `globals.css` (`--accent`, `--card`, `--border`, `--muted`, etc.)
- **Server vs Client split**: Pages and data-fetch are server components; forms and interactive controls are `"use client"` leaf components in `src/components/`

---

## Unchanged Files (Keep As-Is)

- `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`
- `src/types/database.ts`
- `src/components/auth/otp-form.tsx`
- `src/app/api/auth/request-otp/`, `verify-otp/`, `signout/`
- `supabase/migrations/20260312000000_init.sql`, `20260314120000_debtflow_schema.sql`
- `supabase/seed.sql`
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`

---

## Execution Order

```
Phase 1: Cleanup + middleware + dashboard layout
    ↓
Phase 2: Profile trigger migration + profile API
    ↓
Phase 3 Tier 1: Servicers + forgiveness programs APIs
    ↓
Phase 3 Tier 2: Accounts + goals + budget + notifications APIs
    ↓
Phase 4: Dashboard rewrite (debt_accounts data)
    ↓
Phase 3 Tier 3: Transactions + strategies + schedules + refinancing + credit-scores APIs
    ↓
Phase 5a: Onboarding page
    ↓
Phase 5b-5g: Domain pages (accounts, strategies, budget, forgiveness, refinancing, settings)
    ↓
Phase 3 Tier 4: Forgiveness tracking + tax + analytics APIs
    ↓
Phase 6: Toast, error boundaries, loading states, mobile, SEO
```

---

## Verification

```bash
npm run typecheck && npm run lint && npm run build
```
