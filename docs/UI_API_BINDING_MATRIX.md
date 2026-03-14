# DebtFlow UI to REST Binding Matrix

Last updated: 2026-03-14

This document compares the intended business flow from:

- `docs/PLAN_CC.md`
- `docs/debtflow_business_flow_animated.html`

against the current implementation in:

- `src/app/*`
- `src/components/*`
- `src/app/api/*`

Its purpose is to show which business events are already bound from UI to backend, which APIs are present but not used, and which flows are still incomplete.

## Executive Summary

- The product surface is broader than the original starter app and now includes onboarding, a dashboard shell, and multiple feature pages.
- The UI only partially uses the REST layer. Many pages still read directly from Supabase in server components.
- Several REST routes are implemented but have no UI consumer yet.
- The biggest cross-cutting issue is auth inconsistency:
  - custom username/password auth uses `debtflow_session` and `user_sessions` / `refresh_tokens`
  - many route handlers still authorize through `supabase.auth.getUser()`
  - `src/middleware.ts` currently checks `session_token`, which does not match the custom auth cookie name

## Status Legend

- `Bound`: UI event is wired to the intended REST endpoint.
- `Partial`: some of the flow is wired, but the full business event is not complete.
- `Direct Supabase`: the UI exists but bypasses REST and reads directly from Supabase.
- `Pending`: business flow expects it, endpoint exists or should exist, but UI is not using it.
- `Orphaned API`: route exists with no current UI consumer.

## Business Event Mapping

| Business Event | Blueprint REST | Intended UI | Current UI Mapping | Status | Notes |
|---|---|---|---|---|---|
| 1. Sign up | `POST /auth/register`, `POST /auth/login` | `/register`, `/login` | [register](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/app/register/page.tsx), [login](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/app/login/page.tsx), [password-auth-form](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/components/auth/password-auth-form.tsx) | `Bound` | Custom auth entry screens are wired. Session refresh/session inspection are not surfaced in UI. |
| 2. Add debts | `POST /accounts`, `GET /accounts`, `POST /integrations/sync` | onboarding step 1, accounts management | [onboarding](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/app/onboarding/page.tsx) posts `/api/accounts`; [accounts-list](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/components/accounts/accounts-list.tsx) posts `/api/accounts`; accounts page reads Supabase directly | `Partial` | Add account works. Account read/edit/delete/sync are not fully represented in UI through REST. |
| 3. Get a plan | `POST /strategies/calculate`, `POST /strategies`, `PUT /strategies/:id/activate` | onboarding step 2, strategies page | [onboarding](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/app/onboarding/page.tsx) posts `/api/strategies`; [strategy-manager](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/components/strategies/strategy-manager.tsx) uses `/api/strategies/calculate` and `/api/strategies/[id]` | `Partial` | Calculation and patching exist. Explicit activation flow is not wired. Strategies page still preloads directly from Supabase. |
| 4. Schedule payments | `POST /payments/schedule`, `GET /payments/upcoming` | payments page | [payments page](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/app/dashboard/payments/page.tsx) reads Supabase directly | `Pending` | REST endpoints for payments/upcoming/history exist, but the page does not use them. Schedules API is also not bound. |
| 5. Track progress | `GET /analytics/progress`, `GET /analytics/interest-saved`, `GET /payments/history` | dashboard overview, accounts progress, debt-free page | [debt-projection-chart](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/components/dashboard/debt-projection-chart.tsx) uses `/api/analytics/progress`; [accounts page](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/app/dashboard/accounts/page.tsx) also calls `/api/analytics/progress`; debt-free page posts milestone | `Partial` | Progress API is used, but interest-saved and payments-history are not connected in UI. |
| 6. Alerts and offers | `GET /notifications`, `GET /refinancing/offers`, `POST /notifications/read` | dashboard activity, refinancing page | [recent-activity](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/components/dashboard/recent-activity.tsx) uses `/api/notifications`; refinancing page reads Supabase directly | `Partial` | Notifications list is wired. Read-state and refinancing offers are not wired from UI. |
| 7. Forgiveness check | `GET /forgiveness/eligibility`, `GET /forgiveness/tracking`, `POST /forgiveness/tracking/update` | forgiveness page | [forgiveness page](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/app/dashboard/forgiveness/page.tsx) reads Supabase directly; [forgiveness-manager](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/components/forgiveness/forgiveness-manager.tsx) is largely presentational | `Pending` | UI exists, but the blueprint REST flow is not actually bound. |
| 8. Debt free | `POST /analytics/milestone`, `PUT /accounts/:id (inactive)`, `POST /goals` | debt-free page and follow-up goals | [debt-free page](/Users/rajivmehtapy/Documents/Dev/debt-flow/src/app/dashboard/debt-free/page.tsx) posts `/api/analytics/milestone` | `Partial` | Milestone event is fired, but account closure and next-goal creation are not wired. |

## UI to API Mapping

| UI Surface | REST Endpoint(s) Used | Binding Status | Notes |
|---|---|---|---|
| `/login` | `POST /api/auth/login` | `Bound` | Username/email and password login works through custom auth. |
| `/register` | `POST /api/auth/register` | `Bound` | Creates custom auth user. |
| OTP form | `POST /api/auth/request-otp`, `POST /api/auth/verify-otp` | `Bound` | Legacy path still present. |
| `/onboarding` | `POST /api/accounts`, `POST /api/strategies`, `PATCH /api/profile` | `Bound` | Best current example of a full UI to REST flow. |
| `/dashboard` widgets | `GET /api/analytics/progress`, `GET /api/notifications`, `GET /api/accounts` | `Partial` | Summary cards still preload from Supabase; widgets use REST. |
| `/dashboard/accounts` | `POST /api/accounts`, `GET /api/analytics/progress` | `Partial` | Add account is wired, but list/edit/delete are not REST-driven. |
| `/dashboard/budget` | `POST /api/transactions`, `POST /api/budget` | `Partial` | Initial reads bypass REST. No category update flow. |
| `/dashboard/strategies` | `POST /api/strategies/calculate`, `PATCH /api/strategies/[id]` | `Partial` | No activate/delete UI path yet. |
| `/dashboard/payments` | none for page rendering | `Direct Supabase` | Page reads `payment_schedules` and `transactions` directly. |
| `/dashboard/forgiveness` | none for page rendering | `Direct Supabase` | No REST reads or mutation flow from UI. |
| `/dashboard/refinancing` | none for page rendering | `Direct Supabase` | Page bypasses `/api/refinancing` and `/api/refinancing/offers`. |
| `/dashboard/settings` | `PATCH /api/profile`, `POST /api/auth/signout` | `Partial` | Initial profile load bypasses `GET /api/profile`. |
| `/dashboard/debt-free` | `POST /api/analytics/milestone` | `Partial` | The completion workflow is incomplete. |

## API Inventory and Current Consumer Map

| Endpoint | Methods | Current UI Consumer | Current Status |
|---|---|---|---|
| `/api/auth/login` | `POST` | login form | `Bound` |
| `/api/auth/register` | `POST` | register form | `Bound` |
| `/api/auth/request-otp` | `POST` | OTP form | `Bound` |
| `/api/auth/verify-otp` | `POST` | OTP form | `Bound` |
| `/api/auth/signout` | `POST` | settings sign-out | `Bound` |
| `/api/auth/session` | `GET` | none | `Orphaned API` |
| `/api/auth/refresh` | `POST` | none | `Orphaned API` |
| `/api/accounts` | `GET`, `POST` | onboarding, accounts add, export CSV | `Partial` |
| `/api/accounts/[id]` | `PATCH`, `DELETE` | none | `Orphaned API` |
| `/api/profile` | `GET`, `PATCH` | onboarding step completion, settings update | `Partial` |
| `/api/strategies` | `GET`, `POST` | onboarding create | `Partial` |
| `/api/strategies/[id]` | `PATCH`, `DELETE` | strategies manager patch only | `Partial` |
| `/api/strategies/[id]/activate` | `POST` | none | `Orphaned API` |
| `/api/strategies/calculate` | `POST` | strategies manager | `Bound` |
| `/api/budget` | `GET`, `POST`, `PATCH` | budget create category only | `Partial` |
| `/api/transactions` | `GET`, `POST` | budget add transaction only | `Partial` |
| `/api/payments` | `GET`, `POST` | none | `Orphaned API` |
| `/api/payments/upcoming` | `GET` | none | `Orphaned API` |
| `/api/payments/history` | `GET` | none | `Orphaned API` |
| `/api/schedules` | `GET`, `POST` | none | `Orphaned API` |
| `/api/analytics/progress` | `GET` | dashboard chart, accounts page | `Bound` |
| `/api/analytics/interest-saved` | `GET` | none | `Orphaned API` |
| `/api/analytics/milestone` | `POST` | debt-free page | `Bound` |
| `/api/analytics` | `GET` | none | `Orphaned API` |
| `/api/notifications` | `GET` | recent activity widget | `Bound` |
| `/api/notifications/[id]` | `PATCH` | none | `Orphaned API` |
| `/api/notifications/read` | `POST` | none | `Orphaned API` |
| `/api/refinancing` | `GET`, `POST` | none | `Orphaned API` |
| `/api/refinancing/offers` | `GET` | none | `Orphaned API` |
| `/api/forgiveness-programs` | `GET` | none | `Orphaned API` |
| `/api/forgiveness/eligibility` | `GET` | none | `Orphaned API` |
| `/api/forgiveness/tracking` | `GET`, `POST` | none | `Orphaned API` |
| `/api/forgiveness/tracking/[id]` | `PATCH` | none | `Orphaned API` |
| `/api/goals` | `GET`, `POST` | none | `Orphaned API` |
| `/api/credit-scores` | `GET`, `POST` | none | `Orphaned API` |
| `/api/servicers` | `GET` | none | `Orphaned API` |
| `/api/tax` | `GET`, `POST` | none | `Orphaned API` |
| `/api/integrations/sync` | `POST` | none | `Orphaned API` |

## Key Implementation Findings

### 1. The app uses mixed data access patterns

- Server-rendered pages often fetch directly from Supabase.
- Client-side interactions often use REST for create/update actions.
- This is not wrong by itself, but it is inconsistent and makes coverage hard to reason about.

Recommended rule:

- keep direct Supabase reads for server-rendered initial page load
- use REST routes for client-side user actions and incremental refresh flows
- document exceptions explicitly

### 2. Auth is the biggest binding blocker

Current mismatch:

- custom auth uses `debtflow_session` and `refresh_tokens`
- route handlers often require `supabase.auth.getUser()`
- middleware checks `session_token`, not `debtflow_session`

Impact:

- custom-auth users may be able to reach UI routes but still fail on API calls
- some bindings may look complete in code but are not actually end-to-end compatible

### 3. The most complete business flow today is onboarding

The onboarding flow is the clearest fully intentional sequence:

- create account
- add first debt account
- create strategy
- update profile onboarding step
- route to dashboard

That makes it the best pattern to reuse for the remaining feature bindings.

## Recommended Implementation Order

### Phase A: Fix auth consistency first

1. Align `src/middleware.ts` with the real custom auth cookie name.
2. Decide how route handlers authenticate custom-auth users:
   - either resolve custom sessions in API routes
   - or move the app back to full Supabase Auth
3. Audit all API routes currently using `supabase.auth.getUser()` and make them consistent with the chosen auth path.

### Phase B: Complete the business-critical pending UI bindings

1. Payments
   - bind `/dashboard/payments` to `/api/payments/upcoming` and `/api/payments/history`
   - decide whether `/api/schedules` or `/api/payments` owns creation
2. Forgiveness
   - bind `/dashboard/forgiveness` to `/api/forgiveness-programs`, `/api/forgiveness/eligibility`, and `/api/forgiveness/tracking`
   - add at least one mutation event for tracking updates
3. Refinancing and alerts
   - bind `/dashboard/refinancing` to `/api/refinancing/offers`
   - add notification read-state with `/api/notifications/read` or `/api/notifications/[id]`

### Phase C: Close the CRUD completeness gaps

1. Accounts
   - add edit/delete UI using `/api/accounts/[id]`
   - add integration sync trigger using `/api/integrations/sync`
2. Strategies
   - add explicit activate flow using `/api/strategies/[id]/activate`
   - add delete if needed from the strategy screen
3. Budget
   - bind category update flow to `PATCH /api/budget`
   - consider using `GET /api/budget` and `GET /api/transactions` for filter refreshes
4. Debt-free follow-through
   - use `/api/accounts/[id]` to mark accounts inactive
   - use `/api/goals` to create the next savings goal

### Phase D: Decide which orphaned APIs stay

After the business-event bindings are complete:

- keep routes that support a real near-term UI event
- defer or remove routes that have no planned UI consumer
- document any intentionally backend-only routes

## Suggested Acceptance Criteria

- Every business event from the animated blueprint has an intentional UI-to-backend path.
- No business-critical page is still marked `Pending`.
- Every UI-triggered mutation works for the actual production auth model.
- Every retained REST endpoint has either:
  - a current UI consumer
  - a scheduled implementation owner
  - or an explicit backend-only justification

