# DebtFlow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working AI-powered debt optimization platform on top of the existing Next.js + Supabase foundation, delivering authenticated dashboards, debt account management, repayment strategy comparison, budgeting, forgiveness tracking, and a public demo mode.

**Architecture:** Server components fetch data via typed Supabase helpers; interactive controls are `"use client"` leaf components. API routes follow a strict FK-dependency tier order so each route only references tables that already exist. CSS Modules with CSS custom properties handle all styling — no Tailwind migration.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Supabase (PostgreSQL + Auth), CSS Modules, Recharts, Vercel.

---

## Implementation Status

- **Phase 0 (Auth & Schema):** ✅ Complete
  - Custom username/password auth: login, register, refresh, session, signout routes + `/login` + `/register` pages
  - 3 migrations applied: init, debtflow_schema, custom auth routes
  - Supabase types auto-generated at `src/types/database.ts`
- **Phases 1–6:** ❌ Not started

---

## Gap Analysis

| Area | Required | Current State | Action |
|------|----------|---------------|--------|
| Styling | Tailwind (original plan) | CSS Modules | Keep CSS Modules |
| Auth | Full auth flow | ✅ Done | No action |
| Middleware | Auth guard on `/dashboard/*` | None | Create |
| Chart library | Recharts | Not installed | `npm install recharts` |
| Dashboard data | debt_accounts + strategies | Projects demo data | Rewrite |
| API routes | ~22 route groups | None | Create all |
| Domain pages | /onboarding + 8 dashboard pages | None | Create all |
| Domain components | ~35 components | None | Create all |
| Profile trigger | Auto-create profile on signup | Missing | Add migration |
| Shared UI | Nav, toasts, loading, errors | None | Create |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/app/page.tsx` | Remove "Deploy to Vercel" CTA; add "View Demo Dashboard" link |
| `src/app/dashboard/page.tsx` | Rewrite to query `debt_accounts` + `payment_strategies` |
| `src/app/dashboard/page.module.css` | Replace project card styles with summary strip + progress bar |
| `src/app/layout.tsx` | Wrap children with `ToastProvider` (Phase 6) |
| `src/app/onboarding/page.tsx` | Implement all 3 onboarding steps |

---

## Files to Delete

- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

---

## Key Patterns

- **Server Supabase client:** `const supabase = await createServerSupabaseClient()` — always awaited in server components and route handlers
- **Admin client:** `createAdminSupabaseClient()` from `src/lib/supabase/admin.ts` — service role key, server-side only
- **API route shape:** `NextResponse.json({ data } | { error })` — always check session first
- **Types:** `Database["public"]["Tables"]["debt_accounts"]["Row"]` etc. from `src/types/database.ts`
- **CSS Modules:** Pages co-locate `page.module.css`; components co-locate `<Name>.module.css`. Use `--accent`, `--card`, `--border`, `--muted` from `globals.css`
- **Server vs client split:** Pages and data fetches are server components; forms and interactive controls are `"use client"` leaf components under `src/components/`

---

## Unchanged Files

- `src/lib/supabase/server.ts`, `client.ts`, `admin.ts`
- `src/types/database.ts`
- `supabase/migrations/20260312000000_init.sql`, `20260314120000_debtflow_schema.sql`
- `supabase/seed.sql`
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`

**Note on OTP files:** `src/components/auth/otp-form.tsx` and OTP API routes are legacy. Do not remove (useful reference) but do not build new auth features on them.

---

## Execution Order

```
Phase 1: Cleanup + middleware + dashboard layout + chart library
    ↓
Phase 2: Profile trigger migration + profile API
    ↓
Phase 3 Tier 1: Servicers + forgiveness programs APIs (no auth required)
    ↓
Phase 3 Tier 2: Accounts + goals + budget + notifications APIs
    ↓
Phase 4: Dashboard rewrite (debt_accounts data)
    ↓
Phase 3 Tier 3: Transactions + strategies + payments + schedules + refinancing + credit-scores APIs
    ↓
Phase 3 Tier 4: Analytics + forgiveness tracking + tax + milestone APIs
    ↓
Phase 5a: Onboarding page (3 steps)
    ↓
Phase 5b: Dashboard overview components
    ↓
Phase 5c: Accounts pages + components
    ↓
Phase 5d: Strategies pages + components
    ↓
Phase 5e: Budget page + components
    ↓
Phase 5f: Forgiveness page + components
    ↓
Phase 5g: Payments page + Debt-free page
    ↓
Phase 5h: Refinancing + Settings pages
    ↓
Phase 6: Toast, error boundaries, loading states, mobile nav, upgrade badge
```

---

## Phase 1 — Foundation Cleanup

### Task 1.1: Install Recharts + Delete Starter Assets

**Files:**
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

- [ ] Run `npm install recharts`
- [ ] Verify `recharts` appears in `package.json` dependencies
- [ ] Delete the five starter SVGs listed above
- [ ] Run `npm run build` — confirm no import errors from deleted SVGs
- [ ] Commit: `git commit -m "chore: install recharts, remove starter SVGs"`

---

### Task 1.2: Chart Wrapper Component

**Files:**
- Create: `src/components/ui/chart-wrapper.tsx`
- Create: `src/components/ui/ChartWrapper.module.css`

- [ ] Create `src/components/ui/chart-wrapper.tsx`:

```tsx
"use client";

import { ReactNode } from "react";
import styles from "./ChartWrapper.module.css";

interface ChartWrapperProps {
  title?: string;
  children: ReactNode;
  height?: number;
}

export function ChartWrapper({ title, children, height = 240 }: ChartWrapperProps) {
  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div style={{ height }}>{children}</div>
    </div>
  );
}
```

- [ ] Create `src/components/ui/ChartWrapper.module.css`:

```css
.wrapper {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem;
}
.title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--muted);
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

- [ ] Run `npm run typecheck` — no errors
- [ ] Commit: `git commit -m "feat: add ChartWrapper component for recharts theming"`

---

### Task 1.3: Middleware (Auth Guard)

**Files:**
- Create: `src/middleware.ts`

- [ ] Create `src/middleware.ts`:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session_token");

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

- [ ] Start dev server: `npm run dev`
- [ ] Visit `http://localhost:3000/dashboard` without a session — confirm redirect to `/login`
- [ ] Log in and visit `/dashboard` — confirm access is granted
- [ ] Commit: `git commit -m "feat: add middleware auth guard for /dashboard routes"`

---

### Task 1.4: Dashboard Layout + Sidebar Nav

**Files:**
- Create: `src/app/dashboard/layout.tsx`
- Create: `src/app/dashboard/layout.module.css`
- Create: `src/components/ui/nav-link.tsx`
- Create: `src/components/ui/NavLink.module.css`

- [ ] Create `src/components/ui/nav-link.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavLink.module.css";

interface NavLinkProps {
  href: string;
  label: string;
  icon?: string;
}

export function NavLink({ href, label, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link href={href} className={`${styles.link} ${isActive ? styles.active : ""}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}
```

- [ ] Create `src/components/ui/NavLink.module.css`:

```css
.link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.link:hover { background: var(--border); color: var(--foreground); }
.active { background: var(--accent); color: #fff; }
.icon { font-size: 1rem; width: 1.25rem; text-align: center; }
```

- [ ] Create `src/app/dashboard/layout.tsx`:

```tsx
import { NavLink } from "@/components/ui/nav-link";
import styles from "./layout.module.css";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/accounts", label: "Accounts", icon: "💳" },
  { href: "/dashboard/strategies", label: "Strategies", icon: "🎯" },
  { href: "/dashboard/payments", label: "Payments", icon: "📅" },
  { href: "/dashboard/budget", label: "Budget", icon: "📊" },
  { href: "/dashboard/forgiveness", label: "Forgiveness", icon: "🎓" },
  { href: "/dashboard/refinancing", label: "Refinancing", icon: "🔄" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>DebtFlow</div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          {/* UpgradeProBadge added in Phase 6 */}
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
```

- [ ] Create `src/app/dashboard/layout.module.css`:

```css
.shell {
  display: flex;
  min-height: 100vh;
  background: var(--background);
}
.sidebar {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  background: var(--card);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  gap: 0.25rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent);
  padding: 0 0.875rem 1.25rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0.75rem;
}
.nav { display: flex; flex-direction: column; gap: 0.125rem; flex: 1; }
.sidebarFooter { margin-top: auto; }
.content { flex: 1; overflow-y: auto; padding: 2rem; }

@media (max-width: 768px) {
  .sidebar { display: none; }
  .content { padding: 1rem; padding-bottom: 5rem; }
}
```

- [ ] Run `npm run dev`, visit `/dashboard` — confirm sidebar renders
- [ ] Run `npm run typecheck` — no errors
- [ ] Commit: `git commit -m "feat: add dashboard layout with sidebar nav"`

---

## Phase 2 — Auth Consolidation

### Task 2.1: Profile Auto-Create Trigger

**Files:**
- Create: `supabase/migrations/20260315000000_profile_trigger.sql`

- [ ] Create the migration file:

```sql
-- Auto-insert a profiles row when a new user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, onboarding_step, created_at, updated_at)
  values (new.id, 0, now(), now())
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

- [ ] Run `npm run db:reset` — applies migration
- [ ] In Supabase Studio (`http://localhost:54322`), verify the trigger exists on `auth.users`
- [ ] Register a new test account; verify a row appears in `profiles` table
- [ ] Commit: `git commit -m "feat: add profile auto-create trigger on user signup"`

---

### Task 2.2: Profile API Route

**Files:**
- Create: `src/app/api/profile/route.ts`

- [ ] Create `src/app/api/profile/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowed = ["full_name", "employment_type", "annual_income", "onboarding_step"];
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  );

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
```

- [ ] Run `npm run typecheck` — no errors
- [ ] Test: `curl -X GET http://localhost:3000/api/profile` with a valid session cookie — expect `{ data: { ... } }`
- [ ] Test: `curl -X PATCH http://localhost:3000/api/profile -d '{"full_name":"Test"}'` — expect updated profile
- [ ] Commit: `git commit -m "feat: add GET + PATCH /api/profile route"`

---

## Phase 3 — Core API Routes

### Task 3.1: Tier 1 — Reference Data Routes (No Auth)

**Files:**
- Create: `src/app/api/servicers/route.ts`
- Create: `src/app/api/forgiveness-programs/route.ts`

- [ ] Create `src/app/api/servicers/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("loan_servicers").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
```

- [ ] Create `src/app/api/forgiveness-programs/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("forgiveness_programs")
    .select("*")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
```

- [ ] Test both endpoints with curl — confirm 200 + data array
- [ ] Commit: `git commit -m "feat: add public servicers + forgiveness-programs API routes"`

---

### Task 3.2: Tier 2 — User Root Table Routes

**Files:**
- Create: `src/app/api/accounts/route.ts`
- Create: `src/app/api/accounts/[id]/route.ts`
- Create: `src/app/api/goals/route.ts`
- Create: `src/app/api/budget/route.ts`
- Create: `src/app/api/notifications/route.ts`
- Create: `src/app/api/notifications/[id]/route.ts`

- [ ] Create `src/app/api/accounts/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("debt_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("debt_accounts")
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
```

- [ ] Create `src/app/api/accounts/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("debt_accounts")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("debt_accounts")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
```

- [ ] Create `src/app/api/goals/route.ts` — same GET + POST pattern scoped to `user_goals` table
- [ ] Create `src/app/api/budget/route.ts` — GET + POST + PATCH scoped to `budget_categories` table
- [ ] Create `src/app/api/notifications/route.ts` — GET all notifications for user, ordered by `created_at desc`
- [ ] Create `src/app/api/notifications/[id]/route.ts` — PATCH to set `is_read = true`
- [ ] Run `npm run typecheck` — no errors
- [ ] Commit: `git commit -m "feat: add Tier 2 API routes (accounts, goals, budget, notifications)"`

---

### Task 3.3: Tier 3 — Account-Dependent Routes

**Files:**
- Create: `src/app/api/transactions/route.ts`
- Create: `src/app/api/strategies/route.ts`
- Create: `src/app/api/strategies/[id]/route.ts`
- Create: `src/app/api/strategies/calculate/route.ts`
- Create: `src/app/api/payments/route.ts`
- Create: `src/app/api/payments/upcoming/route.ts`
- Create: `src/app/api/schedules/route.ts`
- Create: `src/app/api/refinancing/route.ts`
- Create: `src/app/api/refinancing/offers/route.ts`
- Create: `src/app/api/credit-scores/route.ts`

- [ ] Create `src/app/api/transactions/route.ts` — GET (with optional `?account_id=` + `?month=YYYY-MM` filters) + POST
- [ ] Create `src/app/api/strategies/route.ts` — GET + POST `payment_strategies` for user
- [ ] Create `src/app/api/strategies/[id]/route.ts` — PATCH + DELETE single strategy
- [ ] Create `src/app/api/strategies/calculate/route.ts`:
  - Calculate Snowball vs Avalanche dates based on `debt_accounts`
  - Accept `extra_monthly_payment` in POST body
- [ ] Create `src/app/api/payments/route.ts` — GET + POST payment records; support Principal/Interest split logic
- [ ] Create `src/app/api/payments/upcoming/route.ts` — GET upcoming payments from `payment_schedules` for the next 30 days
- [ ] Create `src/app/api/schedules/route.ts` — GET + POST `payment_schedules`
- [ ] Create `src/app/api/refinancing/route.ts` — GET + POST for user-saved refinancing offers
- [ ] Create `src/app/api/refinancing/offers/route.ts`:
  - GET matching offers for user based on credit score + total debt balance
- [ ] Create `src/app/api/credit-scores/route.ts` — GET + POST `credit_scores` ordered by `recorded_at desc`
- [ ] Commit: `git commit -m "feat: add Tier 3 API routes (transactions, strategies, payments, schedules, refinancing, credit-scores)"`

---

### Task 3.4: Tier 4 — Aggregate + Cross-Table Routes

**Files:**
- Create: `src/app/api/analytics/route.ts`
- Create: `src/app/api/analytics/progress/route.ts`
- Create: `src/app/api/analytics/interest-saved/route.ts`
- Create: `src/app/api/analytics/milestone/route.ts`
- Create: `src/app/api/forgiveness/tracking/route.ts`
- Create: `src/app/api/tax/route.ts`

- [ ] Create `src/app/api/analytics/route.ts` — GET aggregate stats: Total Debt | Monthly Min | Paid %
- [ ] Create `src/app/api/analytics/progress/route.ts`:
  - GET per-account payoff % and overall portfolio progress
  - Return timeline data for `DebtProjectionChart`
- [ ] Create `src/app/api/analytics/interest-saved/route.ts` — GET lifetime interest saved vs minimum-only projection
- [ ] Create `src/app/api/analytics/milestone/route.ts` — POST to log journey milestones (e.g., "debt_free", "fifty_percent")
- [ ] Create `src/app/api/forgiveness/tracking/route.ts`:
  - GET current PSLF/IDR progress (e.g., 84/120)
  - POST new Employer Certification (ECF) submissions
- [ ] Create `src/app/api/tax/route.ts` — GET + POST `tax_optimizations`
- [ ] Commit: `git commit -m "feat: add Tier 4 API routes (analytics, forgiveness tracking, tax, milestone)"`

---

## Phase 4 — Dashboard Rewrite

### Task 4.1: Landing Page Cleanup

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Remove "Deploy to Vercel" CTA and placeholder text
- [ ] Add a "View Demo Dashboard" link pointing to `/dashboard`
- [ ] Keep existing OTP/login form intact
- [ ] Run `npm run dev` — confirm landing page renders without broken SVG references
- [ ] Commit: `git commit -m "feat: update landing page, add demo dashboard link"`

---

### Task 4.2: Dashboard Overview Rewrite

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/page.module.css`

- [ ] Rewrite `src/app/dashboard/page.tsx` to:
  - Call `GET /api/analytics` for aggregate stats (total debt, monthly payment, paid %)
  - Call `GET /api/accounts` for account list
  - Render a summary strip: Total Debt | Monthly Payment | Paid %
  - Render account cards below the strip
  - Support anonymous demo mode: when no session, use service role client to fetch demo data (`is_demo = true`)

```tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let accounts = [];
  if (user) {
    const res = await supabase
      .from("debt_accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("current_balance", { ascending: false });
    accounts = res.data ?? [];
  } else {
    // Demo mode: public read of demo accounts
    const { createAdminSupabaseClient } = await import("@/lib/supabase/admin");
    const admin = createAdminSupabaseClient();
    const res = await admin.from("debt_accounts").select("*").eq("is_demo", true);
    accounts = res.data ?? [];
  }

  const totalDebt = accounts.reduce((s, a) => s + (a.current_balance ?? 0), 0);
  const totalPayment = accounts.reduce((s, a) => s + (a.minimum_payment ?? 0), 0);

  return (
    <div className={styles.page}>
      {!user && <div className={styles.demoBanner}>📊 Demo Mode — <a href="/login">Sign in</a> to manage your debts</div>}
      <h1 className={styles.heading}>Overview</h1>
      <div className={styles.strip}>
        <div className={styles.stat}><span className={styles.statLabel}>Total Debt</span><span className={styles.statValue}>${totalDebt.toLocaleString()}</span></div>
        <div className={styles.stat}><span className={styles.statLabel}>Monthly Payment</span><span className={styles.statValue}>${totalPayment.toLocaleString()}</span></div>
        <div className={styles.stat}><span className={styles.statLabel}>Accounts</span><span className={styles.statValue}>{accounts.length}</span></div>
      </div>
      <div className={styles.accountGrid}>
        {accounts.map((acct) => (
          <div key={acct.id} className={styles.accountCard}>
            <div className={styles.accountName}>{acct.account_name}</div>
            <div className={styles.accountBalance}>${(acct.current_balance ?? 0).toLocaleString()}</div>
            <div className={styles.accountRate}>{acct.interest_rate}% APR · Min ${acct.minimum_payment}/mo</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] Rewrite `src/app/dashboard/page.module.css` with summary strip + account card styles
- [ ] Run `npm run dev` — verify dashboard shows real debt_accounts data when logged in
- [ ] Verify demo mode (logged out) shows demo data
- [ ] Commit: `git commit -m "feat: rewrite dashboard to use debt_accounts data + demo mode"`

---

---

## Phase 5a — Onboarding

### Task 5a.1: Debt Type Select Component

**Files:**
- Create: `src/components/onboarding/debt-type-select.tsx`

- [ ] Create `src/components/onboarding/debt-type-select.tsx`:
  - Dropdown with options: student_loan, credit_card, mortgage, personal_loan, auto_loan, medical, other.
- [ ] Run `npm run typecheck` — no errors
- [ ] Commit: `git commit -m "feat: add DebtTypeSelect onboarding component"`

---

### Task 5a.2: Step Indicator Component

**Files:**
- Create: `src/components/onboarding/step-indicator.tsx`
- Create: `src/components/onboarding/StepIndicator.module.css`

- [ ] Create `src/components/onboarding/step-indicator.tsx`:
  - Progress bar showing current step (1 of 3, etc.).
- [ ] Run `npm run typecheck` — no errors
- [ ] Commit: `git commit -m "feat: add StepIndicator onboarding component"`

---

### Task 5a.3: Onboarding Page (3-Step Wizard)

**Files:**
- Create: `src/app/onboarding/page.tsx`
- Create: `src/app/onboarding/page.module.css`

- [ ] Implement Step 1: Add first debt account (Full form with `DebtTypeSelect`).
- [ ] Implement Step 2: Choose repayment strategy (Comparison cards: Snowball vs. Avalanche with "Months Saved" stats).
- [ ] Implement Step 3: Set monthly target (Currency input + Live chart showing debt-free date impact).
- [ ] Handle "Skip for now" logic and redirect to `/dashboard`.
- [ ] On completion, PATCH `/api/profile` with `{ onboarding_step: 3 }`.
- [ ] Commit: `git commit -m "feat: add 3-step onboarding flow with strategy/budget cards"`

---

## Phase 5b — Dashboard Overview Components

### Task 5b.1: Debt Projection Chart

**Files:**
- Create: `src/components/dashboard/debt-projection-chart.tsx`
- Create: `src/components/dashboard/DebtProjectionChart.module.css`

- [ ] Implement interactive Line/Area chart using Recharts.
- [ ] Fetch data from `GET /api/analytics/progress`.
- [ ] Support toggling between "Actual" and "Projected" lines.
- [ ] Commit: `git commit -m "feat: add DebtProjectionChart dashboard component"`

---

### Task 5b.2: Recent Activity & Milestone Alerts

**Files:**
- Create: `src/components/dashboard/recent-activity.tsx`
- Create: `src/components/dashboard/RecentActivity.module.css`

- [ ] Render activity feed with icons for payments, interest alerts, and milestones.
- [ ] Integrate "Rate Drop Alert" banner for specific high-interest accounts.
- [ ] Commit: `git commit -m "feat: add RecentActivity feed with milestone alerts"`

---

### Task 5b.3: Export Report Button

**Files:**
- Create: `src/components/dashboard/export-report-btn.tsx`

- [ ] Dropdown for CSV/PDF export.
- [ ] Commit: `git commit -m "feat: add ExportReportBtn dashboard component"`

---

## Phase 5c — Accounts Pages + Components

### Task 5c.1: Account Components

**Files:**
- Create: `src/components/accounts/account-form.tsx`
- Create: `src/components/accounts/payoff-progress-bar.tsx`
- Create: `src/components/accounts/closed-accounts-toggle.tsx`

- [ ] `AccountForm`: Full CRUD form with account type badges.
- [ ] `PayoffProgressBar`: Visual indicator showing % of original balance paid off.
- [ ] `ClosedAccountsToggle`: URL-syncing toggle for inactive loans.
- [ ] Commit: `git commit -m "feat: add account components (form, progress, toggle)"`

---

### Task 5c.2: Accounts Pages

**Files:**
- Create: `src/app/dashboard/accounts/page.tsx`
- Create: `src/app/dashboard/accounts/[id]/page.tsx`

- [ ] Implement accounts list with "Interest Saved Lifetime" column.
- [ ] Implement account detail page with transaction history table.
- [ ] Commit: `git commit -m "feat: add accounts list and detail pages"`

---

## Phase 5d — Strategies Pages + Components

### Task 5d.1: Strategy Components (Interactive Reordering)

**Files:**
- Create: `src/components/strategies/strategy-selector.tsx`
- Create: `src/components/strategies/payoff-order-list.tsx`

- [ ] `StrategySelector`: Radio cards for Snowball/Avalanche selection.
- [ ] `PayoffOrderList`: **Implement Drag-and-Drop** reordering for "Custom Strategy" flow (using `dnd-kit`).
- [ ] Show "Live Recalculating" feedback during reorder.
- [ ] Commit: `git commit -m "feat: add strategy selector and interactive reordering list"`

---

### Task 5d.2: Strategies Pages

**Files:**
- Create: `src/app/dashboard/strategies/page.tsx`
- Create: `src/app/dashboard/strategies/calendar/page.tsx`

- [ ] Strategies page: side-by-side comparison cards + prioritized list.
- [ ] Calendar page: Month-by-month projection table.
- [ ] Commit: `git commit -m "feat: add strategies page and payoff calendar"`

---

## Phase 5e — Budget Page + Components

### Task 5e.1: Budget & Category Management

**Files:**
- Create: `src/components/budget/spending-donut.tsx`
- Create: `src/components/budget/category-manager.tsx`
- Create: `src/components/budget/transaction-form.tsx`

- [ ] `SpendingDonut`: Recharts donut chart for % spent.
- [ ] `CategoryManager`: **Manage Categories modal** to add/delete categories and edit limits.
- [ ] `TransactionForm`: Form with category icons and search.
- [ ] Show **"OVER BUDGET"** alerts in red visual states.
- [ ] Commit: `git commit -m "feat: add budget charts and category management UI"`

---

## Phase 5f — Forgiveness Page + Components

### Task 5f.1: Forgiveness Visuals

**Files:**
- Create: `src/components/forgiveness/circular-progress.tsx`
- Create: `src/components/forgiveness/ecf-table.tsx`

- [ ] `CircularProgress`: PSLF progress arc (e.g., 84/120) with **Estimated Forgiveness Date label**.
- [ ] `EcfTable`: Table with **Status Badges** (Approved/Pending) and employment period.
- [ ] `RecertificationAlert`: Banner with "Update Income Details" CTA.
- [ ] Commit: `git commit -m "feat: add forgiveness circular progress and ECF status tracking"`

---

## Phase 5g — Payments + Debt-Free Celebration

### Task 5g.1: Payments Page

**Files:**
- Create: `src/app/dashboard/payments/page.tsx`

- [ ] Upcoming payments calendar view.
- [ ] Payment history table with **Principal/Interest split display**.
- [ ] Commit: `git commit -m "feat: add payments page with history split"`

---

### Task 5g.2: Debt-Free Celebration Flow

**Files:**
- Create: `src/app/dashboard/debt-free/page.tsx`

- [ ] Confetti overlay component.
- [ ] Milestone summary: Total Paid, Interest Saved, Total Journey Time.
- [ ] "Set Next Goal" CTA.
- [ ] Commit: `git commit -m "feat: add debt-free celebration flow"`

---

## Phase 5h — Remaining Domain Pages

### Task 5h.1: Refinancing Comparison

**Files:**
- Create: `src/app/dashboard/refinancing/page.tsx`

- [ ] **Comparison Grid UI**: Side-by-side offer cards showing APR savings and monthly delta.
- [ ] Commit: `git commit -m "feat: add refinancing comparison UI"`

---

### Task 5h.2: Settings & Integration Notes

- [ ] Profile editing (Annual Income, etc.).
- [ ] Add **"Bank Sync: Manual Entry Only"** banner or "Coming Soon" for Plaid integration.
- [ ] Commit: `git commit -m "feat: add settings page and bank sync placeholders"`

---

## Phase 6 — Polish

### Task 6.1: Toast Notification System

**Files:**
- Create: `src/components/ui/toast.tsx`
- Create: `src/components/ui/toast-provider.tsx`
- Create: `src/components/ui/Toast.module.css`

- [ ] Create `toast-provider.tsx` — React context with `addToast(message, type)` + auto-dismiss after 4s
- [ ] Create `toast.tsx` — renders toasts from context; fixed bottom-right; success/error/info variants
- [ ] Wrap `<body>` in `src/app/layout.tsx` with `<ToastProvider>`
- [ ] Commit: `git commit -m "feat: add toast notification system"`

---

### Task 6.2: Loading + Error Boundaries

**Files:**
- Create: `src/components/ui/loading-spinner.tsx`
- Create: `src/app/dashboard/loading.tsx`
- Create: `src/app/dashboard/error.tsx`

- [ ] Create `loading-spinner.tsx` — CSS keyframe spinner; accept `size` prop
- [ ] Create `src/app/dashboard/loading.tsx` — full-page skeleton with sidebar placeholder + content shimmer
- [ ] Create `src/app/dashboard/error.tsx` — `"use client"` error boundary with "Try Again" reset button
- [ ] Commit: `git commit -m "feat: add loading spinner, dashboard loading skeleton, error boundary"`

---

### Task 6.3: Mobile Bottom Nav

**Files:**
- Create: `src/components/ui/mobile-bottom-nav.tsx`
- Create: `src/components/ui/MobileBottomNav.module.css`

- [ ] Create `mobile-bottom-nav.tsx` — `"use client"` fixed bottom bar; 5 items: Home, Strategy, Accounts, Budget, More; active state via `usePathname()`
- [ ] Visible only at `max-width: 768px` via CSS
- [ ] Add to `src/app/dashboard/layout.tsx`
- [ ] Commit: `git commit -m "feat: add mobile bottom navigation bar"`

---

### Task 6.4: Upgrade Pro Badge

**Files:**
- Create: `src/components/ui/upgrade-pro-badge.tsx`
- Create: `src/components/ui/UpgradeProBadge.module.css`

- [ ] Static badge with "Upgrade to Pro" text + CTA button (no payment flow — placeholder)
- [ ] Add to `src/app/dashboard/layout.tsx` in `sidebarFooter`
- [ ] Commit: `git commit -m "feat: add UpgradeProBadge sidebar placeholder"`

---

### Task 6.5: Final Verification

- [ ] Run `npm run typecheck` — zero errors
- [ ] Run `npm run lint` — zero warnings
- [ ] Run `npm run build` — successful build
- [ ] Manually test: register → onboarding → dashboard → add account → strategies → budget → payments → settings → sign out
- [ ] Manually test demo mode: visit `/dashboard` while signed out — confirm demo data renders
- [ ] Commit: `git commit -m "chore: final typecheck + lint pass"`

---

## Schema Note — Account Type Enum

Verify `debt_accounts.account_type` column in `supabase/migrations/20260314120000_debtflow_schema.sql` matches exactly:

```
student_loan | credit_card | mortgage | personal_loan | auto_loan | medical | other
```

If values match → no migration needed.
If values diverge → create `supabase/migrations/20260316000000_account_type_enum.sql` to add/alter the CHECK constraint.

---

## Verification

```bash
npm run typecheck && npm run lint && npm run build
```
