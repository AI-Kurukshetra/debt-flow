# DebtFlow: Gap Analysis — Business Flow × PLAN_CC.md × Design Mockups

Comparative study across three sources:
- `docs/debtflow_business_flow_animated.html` — 8-scene user journey spec
- `docs/PLAN_CC.md` — revised implementation plan
- `docs/images/` — 9 UI design mockups (step_01 through step_09)

**Legend: ✅ Covered | ⚠️ Partial | ❌ Missing**

---

## 1. Navigation / Sidebar

| Feature | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| Overview/Dashboard | ✅ Scene 4 | ✅ dashboard rewrite | ✅ step_01, step_03 | — |
| Accounts | ✅ Scene 1 | ✅ `accounts/page.tsx` | ✅ step_04 | — |
| Strategies | ✅ Scene 2–3 | ✅ `strategies/page.tsx` | ✅ step_05 | — |
| Budget | — | ✅ `budget/page.tsx` | ✅ step_06, step_08 | — |
| Forgiveness | ✅ Scene 6 | ✅ `forgiveness/page.tsx` | ✅ step_07 | — |
| Refinance | ✅ Scene 5 | ✅ `refinancing/page.tsx` | ✅ in nav | ❌ No mockup for refinancing page |
| **Payments** | — | ❌ Not planned | ✅ step_04 nav shows "Payments" | ❌ `dashboard/payments/` page missing from plan |
| Settings | — | ✅ `settings/page.tsx` | ✅ step_08 | — |

---

## 2. Dashboard Overview (step_01, step_03)

| Feature | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| Total debt balance KPI | ✅ Scene 4 | ✅ `GET /analytics` | ✅ $42,150 card | — |
| Monthly minimums KPI | ✅ Scene 1 | ✅ `GET /analytics` | ✅ $850 card | — |
| Projected debt-free date | ✅ Scene 4 | ✅ `GET /analytics` | ✅ Oct 2026 card | — |
| **Debt Reduction Projection chart** | — | ❌ Not planned | ✅ line chart step_01 | ❌ No chart library or component planned |
| **Recent Activity feed** | — | ❌ Not planned | ✅ step_01, step_03 | ❌ No activity/feed component planned |
| **"Export Report" button** | — | ❌ Not planned | ✅ step_03 | ❌ Export functionality missing |
| **"+ New Payment" quick action** | — | ❌ Not planned | ✅ step_03 | ❌ Quick payment CTA not planned |
| Interest Rate Alert in activity | ✅ Scene 5 | ⚠️ `GET /notifications` | ✅ step_03 activity | ⚠️ No UI component for alerts in dashboard |

---

## 3. Onboarding (step_02)

| Feature | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| Multi-step wizard | ✅ Scene 0→1→2 | ✅ `onboarding/page.tsx` | ✅ "Step 1 of 3" | — |
| Step 1: Add debt account form | ✅ Scene 1 | ✅ described | ✅ step_02 | — |
| Debt Type dropdown | — | ❌ Not specified | ✅ step_02 | ❌ Debt type taxonomy not defined in plan |
| **Steps 2 & 3 content** | ⚠️ Implied | ❌ Not defined | ❌ No mockups | ❌ Plan only says "name → add account → choose strategy → done" — no detail |
| "Skip for now" option | — | ❌ Not planned | ✅ step_02 | ❌ Skip/partial onboarding flow missing |

---

## 4. Accounts Page (step_04)

| Feature | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| Account list with balance/rate | ✅ Scene 1 | ✅ `GET /accounts` | ✅ step_04 | — |
| **Payoff progress bar per account** | ✅ Scene 4 | ❌ Not planned | ✅ step_04 "PAYOFF PROGRESS" column | ❌ No progress calculation per account |
| **Interest saved (lifetime)** | ✅ Scene 4 | ❌ Not planned | ✅ "INTEREST SAVED LIFETIME" column | ❌ Missing from analytics plan |
| Last payment date column | ✅ Scene 3 | ❌ Not planned | ✅ step_04 | ❌ Not planned as a displayable field |
| **"View Closed Accounts"** | ✅ Scene 7 (`is_active=false`) | ⚠️ `PUT /accounts/:id (is_active=false)` | ✅ step_04 button | ❌ No filtered view/toggle planned |
| Account detail page | — | ✅ `accounts/[id]/page.tsx` | — | — |
| Account type badges (Credit Card, Student Loan, Mortgage) | ✅ Scene 1 | ❌ Not defined | ✅ step_04 | ❌ Account type enum not specified in plan |

---

## 5. Strategies Page (step_05)

| Feature | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| Snowball vs Avalanche comparison | ✅ Scene 2 | ✅ `strategies/page.tsx` | ✅ step_05 side-by-side | — |
| **Extra monthly payment input + Recalculate** | ✅ Scene 2 | ⚠️ `POST /strategies/calculate` noted | ✅ "$500 + Recalculate" step_05 | ⚠️ API planned but no UI component |
| Months saved comparison | ✅ Scene 2 | ❌ Not planned | ✅ "14 Months saved" step_05 | ❌ No months-saved stat in plan |
| Total interest paid comparison | ✅ Scene 2 | ❌ Not planned | ✅ "$4,230 total interest paid" step_05 | ❌ Not in analytics plan |
| **Prioritized Payoff Order list** | ✅ Scene 3 | ❌ Not planned | ✅ step_05 ordered list | ❌ No ordered payoff list component |
| **"View Detailed Payoff Calendar"** | ✅ Scene 3 | ❌ Not planned | ✅ step_05 link | ❌ No payoff calendar page |
| Custom plan (drag to reorder) | ✅ Scene 2 | ❌ Not planned | — | ❌ Missing entirely |

---

## 6. Budget Page (step_06, step_08, step_09 mobile)

| Feature | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| Category spending cards | — | ✅ `budget/page.tsx` | ✅ step_06, step_08 | — |
| Budget donut chart (% spent) | — | ❌ Not planned | ✅ step_06, step_09 "72%" | ❌ No chart component planned |
| **Budget vs Actual bar chart (6 months)** | — | ❌ Not planned | ✅ step_08 | ❌ Missing entirely |
| **Transaction History table** | — | ⚠️ `transactions/route.ts` | ✅ step_06 with search/filter | ⚠️ API exists but no transactions UI planned |
| **"New Transaction" button** | — | ❌ Not planned | ✅ step_06 | ❌ Transaction entry UI missing |
| **"Customize Categories"** | — | ❌ Not planned | ✅ step_06 | ❌ Not planned |
| Month/period picker | — | ❌ Not planned | ✅ "October 2023" picker step_06 | ❌ Not planned |
| **"Over Budget" alert state** | — | ❌ Not planned | ✅ step_08 Transport "OVER BUDGET -$12" | ❌ No over-budget alert logic |
| **"Upgrade Pro" upsell** | — | ❌ Not planned | ✅ step_08 sidebar badge | ❌ No premium tier concept in plan |
| Mobile bottom nav | — | ❌ Not planned | ✅ step_09 | ❌ Phase 6 mentions "mobile" but no bottom nav |

---

## 7. Loan Forgiveness Page (step_07)

| Feature | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| PSLF progress (84/120) | ✅ Scene 6 | ✅ `forgiveness/tracking/route.ts` | ✅ circular progress step_07 | — |
| Estimated forgiveness date | ✅ Scene 6 | ⚠️ in tracking data | ✅ "Oct 2027" step_07 | ⚠️ Not a planned UI element |
| **Circular progress component** | — | ❌ Not planned | ✅ step_07 | ❌ No circular chart component planned |
| **Recertification countdown alert** | ✅ Scene 6 (employer cert) | ❌ Not planned | ✅ "due in 45 days" step_07 | ❌ Missing entirely |
| **"Update Income Details" CTA** | — | ❌ Not planned | ✅ step_07 button | ❌ Income update flow missing |
| **Employer Certification table** | ✅ Scene 6 | ❌ Not planned | ✅ with employer/period/status/actions | ❌ ECF table + schema missing from plan |
| **"+ Submit New ECF" button** | ✅ Scene 6 | ❌ Not planned | ✅ step_07 | ❌ ECF submission form not in plan |
| IDR tracking | ✅ Scene 6 | ⚠️ implied in programs | ❌ Not in mockup | ⚠️ Partial |

---

## 8. Alerts & Refinancing (Scene 5 of business flow)

| Feature | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| Rate drop alert | ✅ Scene 5 | ⚠️ `GET /notifications` | ✅ step_03 activity | ⚠️ No dedicated alerts UI page |
| Refinancing offers list | ✅ Scene 5 | ✅ `refinancing/page.tsx` | ✅ in nav | ❌ No mockup; no design spec |
| `GET /refinancing/offers` sub-route | ✅ Scene 5 | ❌ Flat route only | — | ❌ Sub-path mismatch |
| Milestone notifications | ✅ Scene 5 | ❌ Not planned | — | ❌ No milestone event system |
| Payment reminders | ✅ Scene 5 | ❌ Not planned | — | ❌ No reminder scheduling |

---

## 9. Cross-cutting Gaps

| Area | Business Flow | PLAN_CC.md | Mockups | Gap |
|---|---|---|---|---|
| **Chart library** | — | ❌ None chosen | ✅ Line, donut, bar charts | ❌ No charting dependency planned (recharts/chart.js) |
| **Premium/Pro tier** | — | ❌ Not mentioned | ✅ step_08 "Upgrade Pro" | ❌ Monetization model absent from plan |
| **Bank sync / integrations** | ✅ Scene 1 | ❌ Not planned | — | ❌ `POST /integrations/sync` entirely absent |
| **`POST /analytics/milestone`** | ✅ Scene 7 | ❌ Not planned | — | ❌ Missing |
| **Debt-free celebration flow** | ✅ Scene 7 | ❌ Not planned | — | ❌ Missing |
| **Goals post-debt-free** | ✅ Scene 7 | ⚠️ `goals/route.ts` | — | ⚠️ API exists, no UI or trigger |
| Mobile responsive layout | — | ⚠️ Phase 6 only | ✅ step_09 full mobile mockup | ⚠️ Mobile not formally planned with bottom nav |
| `POST /strategies/calculate` separate step | ✅ Scene 2 | ⚠️ mentioned | ✅ "Recalculate" button | ⚠️ No UI component |
| Autopay / scheduled payments | ✅ Scene 3 | ❌ No payments route | — | ❌ `/payments/` routes missing |
| `GET /analytics/progress` sub-route | ✅ Scene 4 | ❌ Flat analytics only | — | ❌ Sub-path not planned |
| `GET /analytics/interest-saved` sub-route | ✅ Scene 4 | ❌ Flat analytics only | — | ❌ Sub-path not planned |

---

## Summary Scorecard

| Phase / Area | Aligned | Partial | Missing |
|---|---|---|---|
| Auth & Schema (Phase 0) | ✅ Complete | — | — |
| Dashboard Overview | 3 KPIs | Activity alerts | Chart, Export, New Payment, Activity feed |
| Onboarding | Step 1 form | — | Steps 2–3 detail, Skip flow, Debt type enum |
| Accounts | List + CRUD | Closed accounts API | Payoff progress, Interest saved, Type badges |
| Strategies | Comparison cards | Calculate API | Payoff order list, Calendar, Drag reorder, Stats |
| Budget | Categories | Transactions API | Charts (donut+bar), Transaction UI, Customize, Month picker, Over-budget state |
| Forgiveness | Programs data | Tracking API | Circular progress, ECF table, Countdown, Income update |
| Refinancing | Route planned | — | Design mockup, Sub-routes, Offer comparison UI |
| Notifications/Alerts | GET route | — | Milestone events, Reminders, Rate alerts UI |
| Cross-cutting | — | Mobile Phase 6 | Charts library, Premium tier, Bank sync, Debt-free flow, Payments routes |
