# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: App Router pages and route handlers. The root route `src/app/page.tsx` is an auth-aware redirect, not a visible marketing page.
- `src/app/login/page.tsx`, `src/app/register/page.tsx`, and `src/app/onboarding/page.tsx` are the main public entry flows.
- `src/app/dashboard`: authenticated product shell plus feature routes for `accounts`, `budget`, `debt-free`, `forgiveness`, `payments`, `refinancing`, `settings`, and `strategies`, with shared `layout.tsx`, `loading.tsx`, and `error.tsx`.
- `src/app/api`: route handlers for auth plus domain APIs for accounts, analytics, budget, credit scores, forgiveness, goals, notifications, payments, profile, refinancing, schedules, servicers, strategies, tax, and transactions.
- `src/components`: feature-oriented UI grouped by domain (`accounts`, `auth`, `budget`, `dashboard`, `forgiveness`, `onboarding`, `payments`, `refinancing`, `settings`, `strategies`, `ui`).
- `src/lib/auth`:
  - `custom.ts` owns custom username/password session cookies and token rotation
  - `server.ts` is the shared app-auth resolver for dashboard pages and API routes
- `src/lib/supabase`:
  - `server.ts` for request-scoped server Supabase clients
  - `client.ts` for browser use
  - `admin.ts` for service-role operations only
- `src/middleware.ts`: protects `/dashboard/*` by checking `debtflow_session` and fallback Supabase cookies.
- `src/types/database.ts`: typed public-schema contract for app-facing Supabase clients.
- `supabase/migrations`: starter schema, expanded DebtFlow schema, custom auth tables/functions, and follow-up profile trigger work.
- `supabase/seed.sql`: shared reference data plus dev fixture users and backend development data.
- `docs/PLAN_codex.md`: current phased implementation plan.
- `docs/PLAN_CC.md` and `docs/UI_API_BINDING_MATRIX.md`: current business-flow and UI/API binding references.
- `start_server.sh`: local dev helper that starts the app and prints `/login`-first local/public URLs.

## Build, Test, and Development Commands
- `npm run dev`: starts Next.js dev server on `http://localhost:3000`.
- `npm run build`: production compile and type check via Next.js.
- `npm run start`: runs the production Next.js server.
- `npm run lint`: runs ESLint.
- `npm run typecheck`: runs `tsc --noEmit`.
- `npm run supabase:start` / `npm run supabase:stop`: manage the local Supabase stack.
- `npm run db:status`: inspect local Supabase status.
- `npm run db:reset`: re-apply migrations and seeds locally.
- `npx supabase db push --include-all`: push pending migrations to the linked remote Supabase project.
- `npx supabase projects api-keys --project-ref <ref> -o env`: refresh local Supabase env values when CLI access is available.
- `./start_server.sh`: starts the app, waits for `/login`, and optionally opens a Cloudflare quick tunnel.

## Coding Style & Naming Conventions
- Use 2-space indentation, TypeScript strict mode, and normal Next.js App Router file conventions (`page.tsx`, `layout.tsx`, route-local `page.module.css`).
- Keep components under `src/components/<feature>` and use PascalCase exports.
- Use CSS modules for route/component styling and reuse the tokens in `src/app/globals.css`.
- Preserve the current dashboard visual language across authenticated and auth-entry pages; avoid introducing a parallel theme system.
- The default browser flow is login-first:
  - `/` redirects signed-out users to `/login`
  - `/` redirects authenticated users to `/dashboard`
  - sign-out returns to `/login`
- The app currently supports two auth tracks:
  - legacy OTP via Supabase Auth route handlers
  - custom username/password auth via `src/lib/auth/custom.ts`
- When working on auth-sensitive code, prefer `getAuthenticatedAppContext()` or `getCurrentAppUser()` from `src/lib/auth/server.ts` so custom auth and Supabase auth stay aligned.
- Keep custom-auth session handling cookie-based and server-owned. Current cookies are `debtflow_session` and `debtflow_refresh`.
- Use `await createServerSupabaseClient()` in server components and route handlers; the server helper is async.
- Use `src/lib/supabase/admin.ts` only for backend-only or service-role work. Do not import it into client components.
- The typed `Database` contract reflects the public app schema. For custom-auth admin access to tables not captured there, follow the current pattern: keep the admin client untyped at the source and cast only where needed.
- Preserve the route-per-feature structure under `src/app/dashboard/*` and the matching domain component folders.
- Existing charting and interaction work uses `recharts` and `@dnd-kit/*`; prefer reusing those libraries instead of adding parallel UI stacks.
- `src/app/layout.tsx` uses `next/font/google` (`Geist`, `Geist Mono`), so builds may require network access in restricted environments.

## Testing Guidelines
- No automated test suite exists yet. Add focused unit or integration tests near the feature they cover in `src/` when you introduce meaningful behavior.
- Prefer descriptive test names like `PasswordAuthForm submits login credentials`.
- Before handing off a change, run `npm run lint` and `npm run typecheck`.
- For manual verification, cover the flows affected by your change:
  - login-first redirect behavior
  - custom username/password login
  - OTP auth if touched
  - onboarding if touched
  - the relevant dashboard feature route and any API route it triggers
- For schema work:
  - local: `npm run db:reset` when Docker is available
  - hosted: `npx supabase db push --include-all`
- When changing seeded backend data, verify at least one dev user can sign in and only access their own rows under RLS.

## Commit & Pull Request Guidelines
- Commit messages follow `<scope>: <short description>` and should stay under 72 characters.
- PRs should include a concise summary, linked issue/ticket when available, and a note if Supabase migrations, seeds, or env updates are required.
- Include screenshots for UI changes when possible.
- If a change affects auth, middleware, or session handling, state clearly whether it impacts custom auth, Supabase Auth, or both.

## Configuration & Security Tips
- Keep `.env.local` out of Git. It currently needs the Supabase URL, anon key, service-role key, and any local-only DB/CLI secrets.
- Regenerate leaked service-role or DB credentials in Supabase and then update `.env.local`, Vercel secrets, and CLI-linked workflows together.
- Never commit plaintext passwords, session tokens, anon keys, service-role keys, or remote DB passwords.
- Treat the remote Supabase project as a shared environment: prefer additive migrations and avoid destructive resets unless explicitly requested.
- Cloudflare quick tunnels from `start_server.sh` are temporary and public by default; use them for demos, not production.
