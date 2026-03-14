# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: App Router pages and route handlers. The starter landing page is `src/app/page.tsx`; authenticated product entrypoints include `src/app/login/page.tsx`, `src/app/register/page.tsx`, and `src/app/dashboard/page.tsx`; auth endpoints live under `src/app/api/auth/*`.
- `src/components`: client-side UI for both auth paths, including `src/components/auth/otp-form.tsx` and `src/components/auth/password-auth-form.tsx`.
- `src/lib/supabase`: browser, server, and admin Supabase helpers. The server helper is async and must be awaited in server components and route handlers.
- `src/lib/auth`: custom username/password session logic layered on top of the Supabase-backed app.
- `src/types/database.ts`: typed database contract for the Supabase schema used by the app-facing clients.
- `supabase/migrations`: schema history, including the starter schema, additive DebtFlow schema, and the custom auth tables/functions migration.
- `supabase/seed.sql`: shared reference/demo content plus dev fixture data for custom-auth users and backend feature development.
- `docs/PLAN.md` is legacy planning context; `docs/PLAN_codex.md` is the current phased implementation plan aligned to the present starter-pack codebase.
- `start_server.sh` provides a one-command local + Cloudflare preview flow.

## Build, Test, and Development Commands
- `npm run dev`: starts Next.js dev server (App Router) on `http://localhost:3000`.
- `npm run build`: performs a production compile and type check via Next.js.
- `npm run lint`: runs ESLint configured by `eslint.config.mjs`.
- `npm run typecheck`: executes `tsc --noEmit` for static typing validation.
- `npm run supabase:start` / `stop`: manage local Supabase containers once Docker is available.
- `npm run db:status`: inspects Supabase local status; `npm run db:reset` re-applies migrations + seed via CLI against the local Supabase stack.
- `npx supabase db push --include-all`: pushes pending migrations to the linked remote Supabase project when working against hosted infrastructure.
- `npx supabase projects api-keys --project-ref <ref> -o env`: convenient way to refresh local Supabase env values when CLI access is available.
- `./start_server.sh`: ensures `cloudflared` is installed, starts the app on port `3000`, and prints a temporary public `trycloudflare.com` URL.

## Coding Style & Naming Conventions
- Source files use 2-space indentation, TypeScript with strict mode, and Next.js App Router conventions (`page.tsx`, `layout.tsx`).
- Component files live under `src/components/<feature>` and use PascalCase exports (`OtpForm`, `PasswordAuthForm`, etc.).
- Styling uses CSS modules (`*.module.css`) scoped per component or route and leverages CSS custom properties defined in `globals.css`.
- Route-local styles should follow the actual file on disk (`page.module.css` beside the route file); keep imports aligned with filenames.
- Server-side Supabase access must use `await createServerSupabaseClient()`; do not treat the helper as synchronous.
- Public demo reads in the dashboard are intentionally separated from authenticated reads; preserve that distinction when changing dashboard queries or access behavior.
- The app currently supports two auth tracks during transition:
  - OTP via Supabase Auth route handlers
  - custom username/password auth via `src/lib/auth/custom.ts` and the `/api/auth/login|register|refresh|session` routes
- Prefer extending the current starter-pack app incrementally. Do not remove the landing page, demo dashboard path, or OTP flow unless the task explicitly includes that migration.
- Use `src/lib/supabase/admin.ts` only for service-role or backend-only operations; never import it into client components.
- Keep custom-auth session handling cookie-based and server-owned; do not move password or token logic into the browser.
- Pre-commit formatting follows ESLint and TypeScript defaults; run `npm run lint`/`typecheck` before PRs.

## Testing Guidelines
- No automated test suite yet—add targeted unit or integration tests near the feature they cover in `src/` (e.g., `src/components/auth/otp-form.test.tsx`).
- Prefer descriptive test names that include the component and behavior (e.g., `OtpForm handles OTP verification`).
- Run `npm run test` once a suite exists; for now validate manually with `npm run dev`, anonymous `/dashboard` access, OTP auth, and custom username/password auth flows.
- For schema work, validate both local and remote expectations:
  - local: `npm run db:reset` when Docker is available
  - hosted: `npx supabase db push --include-all` against the linked project
- When changing seeded backend data, verify at least one custom-auth dev user can sign in and read only their own rows under RLS.

## Commit & Pull Request Guidelines
- Commit messages follow `<scope>: <short description>` (e.g., `supabase: add seed data`). Keep lines under 72 characters.
- Pull requests require a concise description of changes, linked issue/ticket if available, and whether Supabase migrations or env updates need release notes.
- Include screenshots or video links for UI changes when possible; mention any manual steps to push Supabase migrations, seed backend fixtures, run `start_server.sh`, or configure Vercel envs in the PR description.

## Configuration & Security Tips
- Keep `.env.local` out of Git; it currently needs the Supabase URL, anon key, service-role key, and any local-only database connection secrets required for CLI workflows.
- Regenerate Supabase service-role or database credentials in the dashboard if leaked; update `.env.local`, Vercel secrets, and any linked CLI workflow values together.
- Never commit seeded plaintext passwords, session tokens, anon keys, service-role keys, or remote DB passwords into tracked files or docs.
- The remote Supabase project is treated as a real shared environment; prefer additive migrations and avoid destructive resets unless explicitly requested.
- Cloudflare quick tunnels are temporary and public by default; use them for demos, not as a production deployment path.
