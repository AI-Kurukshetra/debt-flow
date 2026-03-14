# DebtFlow Advanced Roadmap: Production & Intelligence

This plan outlines the steps to transition DebtFlow from a functional core to a production-hardened platform with automated intelligence and third-party integrations.

---

## Phase 7: Production Readiness & Data Integrity
**Goal:** Ensure the platform is secure, fast, and bug-free for the first cohort of real users.

- [ ] **RLS Security Audit**: 
  - Verify every table has `auth.uid() = user_id` policies.
  - Test "Data Leakage" by attempting to access Account ID of User B with User A's session.
- [ ] **Data Validation Middleware**: 
  - Add Zod validation to Tier 2/3 API routes to prevent malformed currency/interest data.
- [ ] **Performance Pass**: 
  - Implement React `Suspense` boundaries for charts to prevent blocking page loads.
  - Add indexing to `transactions(user_id, transaction_date)` for faster budget lookups.
- [ ] **UAT (User Acceptance Testing)**:
  - Script: Create user -> Onboard -> Add 3 accounts -> Set Strategy -> Log 2 payments -> Verify Chart change.

---

## Phase 8: Automation & Notifications
**Goal:** Transition from a manual tracking tool to an automated financial assistant.

- [ ] **Automated Reminders**:
  - Implement a Supabase Edge Function (Cron) that checks `payment_schedules` daily.
  - Trigger a `notification` entry 3 days before a due date.
- [ ] **Rate Drop Monitoring**:
  - Function to compare current `debt_accounts.interest_rate` against a mock `market_rates` table.
  - Trigger a "Refinance Alert" notification if a >1.0% spread is found.
- [ ] **Milestone Engine**:
  - Automatically log "First 10% Paid" or "Debt Free" milestones when balance updates occur.

---

## Phase 9: Third-Party Integrations (Plaid)
**Goal:** Remove the friction of manual data entry.

- [ ] **Plaid API Setup**:
  - Create `src/app/api/integrations/plaid/link-token` route.
  - Implement `PlaidLink` component in the Accounts module.
- [ ] **Transaction Sync**:
  - Webhook handler to pull real bank transactions and map them to `budget_categories`.
- [ ] **Balance Refresh**:
  - Daily sync of loan balances to keep the `DebtProjectionChart` accurate without user input.

---

## Phase 10: AI Payoff Optimizer
**Goal:** Use the "AI" in DebtFlow to provide value beyond simple Snowball/Avalanche models.

- [ ] **Optimization Engine**:
  - Implement a "Perfect Split" algorithm that accounts for tax-deductible interest (mortgage/student loans) vs. high-interest consumer debt.
- [ ] **Spending Insight Agent**:
  - Analysis tool that identifies "Leaking Cash" (e.g., "You spent $40 more on coffee this month than your interest savings on your Chase card").
- [ ] **Natural Language Query**:
  - Simple chat interface: "How much faster am I debt free if I pay $200 extra?"

---

## Phase 11: Launch & Scaling
**Goal:** Deploy to the world.

- [ ] **Production Env Setup**:
  - Provision production Supabase project and Vercel project.
  - Set `NEXT_PUBLIC_APP_URL` and SSL certificates.
- [ ] **Analytics & Tracking**:
  - Integrate PostHog or Vercel Analytics to track onboarding completion rates.
- [ ] **Marketing Landing Page**:
  - Finalize `src/app/page.tsx` with high-converting copy and screenshots of the actual app.
