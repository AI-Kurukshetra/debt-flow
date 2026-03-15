# DebtFlow

AI-powered debt optimization and financial freedom platform.

# Deployment Guidelines

## Pre-deploy checklist
- Link this repo to your Supabase project (`npx supabase link --project-ref <ref>`). Confirm `.env.local` mirrors the required keys from `.env.example`.
- Ensure migrations are applied and sample data seeded locally: `npm run db:reset` (Docker required).
- Update `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in your production env and Vercel project secrets.

## Local workflow
- Copy `.env.example` to `.env.local` and fill the Supabase URL/keys.
- Start Supabase containers when developing: `npm run supabase:start` and stop them with `npm run supabase:stop` after work.
- Run `npm run dev` to launch the Next.js server locally, then open `http://localhost:3000` to view the current landing page served from `src/app/page.tsx`.
- If you only want to preview the homepage, Supabase containers are not required; they are only needed for auth, migrations, and local database work.
- When the server starts, Next.js prints the active local URL and any alternate port if `3000` is busy.
- Use `supabase studio` (http://localhost:54322) or `npx supabase db dump --linked` for schema inspection while iterating.

## One-command public preview
- Make the launcher executable once: `chmod +x ./start_server.sh`
- Run `./start_server.sh` from the repo root.
- The script checks for `cloudflared`, installs it if needed, starts Next.js on port `3000`, creates an anonymous quick tunnel, and prints a public `trycloudflare.com` URL.
- Keep the script running while sharing the page; press `Ctrl+C` to stop both the local server and the tunnel.

## Supabase production prep
- Keep `supabase/migrations/*.sql` and `supabase/seed.sql` in sync; run `npx supabase db push` after editing SQL assets.
- Use `npx supabase gen types typescript --local > src/types/database.ts` when schema changes to keep client helpers typed.
- Rotate `service_role` or anon keys from the Supabase dashboard if migrating environments, and update `.env.example`/`.env.local` accordingly.

## Vercel deployment
- Import the repository through the Vercel dashboard; it auto-detects Next.js (App Router).
- Configure these Environment Variables under the project settings:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (only in preview/production if backend tasks need it; keep secret)
- Point the build command to `npm run build` and the output directory remains the default `.next`.
- Deploy and monitor logs via Vercel; rerun `npm run lint`/`typecheck` locally before creating a deployment pull request.

## Post-deploy verification
- Visit the deployed site and confirm the OTP auth flow works (email link should arrive via Supabase).
- Check `/dashboard` to ensure seeded `projects` and `project_updates` render without errors.
- If there are Supabase connection issues, confirm the `NEXT_PUBLIC_SUPABASE_*` values in Vercel match the linked project.

## Optional steps
- For repeatable builds, document your Supabase project ref and API key rotation schedule in this README or a companion note.
- Keep `.env.local` out of version control; commit only `.env.example`.

## Dev seed credentials added:
  - rajiv_demo / rajiv_demo@debtflow.dev / DevPass123!
  - maya_demo / maya_demo@debtflow.dev / DevPass123!

## Recording

  Scene 1 — Sign Up & Onboarding (0:15–1:00)                                              
                                                                                          
  Business value: Frictionless activation

  1. Open /register — "Create your DebtFlow account" with email + password
  2. Step 1 — Add first debt: Enter a student loan (lender, balance $28,000, 6.5% APR,
  $300/mo minimum)
    - "DebtFlow accepts any debt type — student loans, credit cards, auto loans"
  3. Step 2 — Choose strategy: Highlight the two options side by side
    - Select Debt Avalanche (highest savings, recommended badge)
    - "Avalanche saves the most money. Snowball gives you faster wins."
  4. Step 3 — Set monthly budget: Enter $1,200/mo
    - "Your budget becomes the engine for all projections"
  5. Hit "Finish Setup" → lands on dashboard

  ---
  Scene 2 — Dashboard Overview (1:00–1:45)

  Business value: Instant clarity on financial position

  1. Show the 3 stat cards — Total Debt, Monthly Minimum, % Progress Paid
  2. Scroll to Debt Reduction Projection Chart
    - "This chart shows exactly when you'll be debt-free, month by month"
  3. Point to Recent Activity feed — payments confirmed, milestones, alerts
    - "Nothing falls through the cracks — every event is logged"
  4. Show Active Accounts grid — balances, rates, payments at a glance

  ---
  Scene 3 — Accounts (1:45–2:15)

  Business value: All your debt in one place

  1. Navigate to Accounts → show the full table (balance, APR, progress bar, interest
  saved)
  2. Click "+ Add New Account" → add a credit card ($4,200 at 22%)
    - "Add as many accounts as you have"
  3. Show Interest Saved column updating per account
    - "DebtFlow tracks how much you've saved vs paying minimums only"

  ---
  Scene 4 — Strategy Manager (2:15–3:15)

  Business value: Personalized payoff roadmap

  1. Navigate to Strategies → show the active strategy card
  2. Click the strategy name → rename it inline ("My 2026 Payoff Plan")
  3. Adjust the Extra Monthly Payment slider — watch projected payoff date move
    - "Adding just $100/mo can cut years off your debt"
  4. Show account payoff order updating based on strategy
  5. Switch to Custom strategy → drag-and-drop to reorder accounts
    - "Full control if your situation requires a specific order"

  ---
  Scene 5 — Payments (3:15–3:45)

  Business value: Stay on track, never miss a payment

  1. Navigate to Payments → Upcoming — show scheduled payments with due dates
  2. Switch to Payment History tab — show the principal vs interest breakdown per payment
    - "See exactly how much of each payment goes to principal vs interest"

  ---
  Scene 6 — Budget Planner (3:45–4:30)

  Business value: Connect spending habits to debt payoff

  1. Navigate to Budget — show the spending donut chart with categories
  2. Click "Manage Categories" → add a "Debt Payment" category with $1,200 budget
  3. Click "+ New Transaction" → log a transaction
    - "Track where your money actually goes each month"
  4. Show the Category Breakdown — progress bars, over-budget in red
    - "Know immediately if spending is threatening your payoff plan"

  ---
  Scene 7 — Loan Forgiveness (4:30–5:00)

  Business value: Don't leave money on the table

  1. Navigate to Forgiveness — show PSLF circular progress (e.g. 47 of 120 payments)
    - "If you work in public service, you could have tens of thousands forgiven"
  2. Show the program cards — PSLF, PAYE, SAVE
    - "DebtFlow tracks every program you may qualify for"
  3. Point to Recertification Alert — "Recertify within 30 days"
    - "We remind you before deadlines so you never lose qualifying payments"

  ---
  Scene 8 — Refinancing (5:00–5:30)

  Business value: Lower your rate, accelerate payoff

  1. Navigate to Refinancing — show current avg APR vs best offer
  2. Show the Recommended Offers grid — each card with lender, APR, term, savings vs
  current
    - "Compare real offers side by side without leaving the app"
  3. Point to Pre-Qualified badge and Apply button

  ---
  Close — Debt-Free Screen (5:30–6:00)

  Business value: The finish line is real

  1. Navigate to /dashboard/debt-free — show the celebration page
  2. Show: Total Debt Paid, Interest Saved, Journey Time
    - "This is what DebtFlow is building toward — your debt-free day"
  3. Show the "Set Your Next Goal" CTA
    - "When debt is gone, you redirect that money to wealth building"

  ---
  Recommended Demo Tips

  - Use the demo mode (/dashboard unauthenticated) if you don't want real credentials on
  screen
  - Pre-fill accounts with realistic numbers (student loan + credit card is relatable)
  - Keep the extra payment slider interaction — it's the most visually compelling moment
  - Record at 1280×800 or wider to show the sidebar + content comfortably