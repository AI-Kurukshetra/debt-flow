# Plan: Fix Dashboard Infinite Loop

## Objective
Resolve the infinite redirect loop between `/dashboard` and `/login`.

## Root Cause Analysis
The loop was caused by a cookie name mismatch in the authentication middleware:
1. **Middleware (`src/middleware.ts`)**: Was checking for a cookie named `session_token`.
2. **Custom Auth (`src/lib/auth/custom.ts`)**: Uses a cookie named `debtflow_session` for access tokens.
3. **Behavior**:
   - Middleware doesn't see `session_token`, assumes user is logged out, redirects to `/login`.
   - `/login` page checks for `debtflow_session`, sees the user is logged in, redirects to `/dashboard`.
   - Loop repeats indefinitely.

## Proposed Changes
1. **Update Middleware**:
   - Change cookie check from `session_token` to `debtflow_session`.
   - Add a fallback check for standard Supabase auth cookies (prefixed with `sb-`).
2. **Update Implementation Plan**:
   - Align `docs/PLAN_CC.md` with the corrected middleware logic.

## Verification
- User should be able to access `/dashboard` without being redirected to `/login` when a valid `debtflow_session` cookie is present.
- Build integrity check: `npm run typecheck && npm run build`.
