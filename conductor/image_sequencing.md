# Image Sequencing & Gap Analysis Plan

## Objective
Rename downloaded UI mockups to match the logical flow of the application as described in `docs/PLAN_CC.md`, and identify any missing screens (gaps).

## Logical Sequence & Renaming

1. **Overview / Landing Page** (Phase 1 / Base)
   - `DebtFlow_Overview_Desktop.png` ➔ `step_01_DebtFlow_Overview_Desktop.png`
2. **Onboarding** (Phase 5a: Onboarding page)
   - `Onboarding_Step_1_Desktop.png` ➔ `step_02_Onboarding_Step_1_Desktop.png`
3. **Dashboard Main** (Phase 4: Dashboard rewrite)
   - `DebtFlow_Dashboard_Polished.png` ➔ `step_03_DebtFlow_Dashboard_Polished.png`
4. **Accounts** (Phase 5b-5g: Domain pages - accounts)
   - `Debt_Accounts_Desktop.png` ➔ `step_04_Debt_Accounts_Desktop.png`
5. **Payment Strategy** (Phase 5b-5g: Domain pages - strategies)
   - `Payment_Strategy_Desktop.png` ➔ `step_05_Payment_Strategy_Desktop.png`
6. **Budget Planner** (Phase 5b-5g: Domain pages - budget)
   - `Budget_Planner_Desktop_Refined.png` ➔ `step_06_Budget_Planner_Desktop_Refined.png`
7. **Loan Forgiveness** (Phase 5b-5g: Domain pages - forgiveness)
   - `Loan_Forgiveness_Analyzer_Desktop.png` ➔ `step_07_Loan_Forgiveness_Analyzer_Desktop.png`

**Alternatives / Variants:**
8. **Budget Planner (Original)**
   - `Budget_Planner_Desktop.png` ➔ `step_08_Budget_Planner_Desktop.png`
9. **Budget Planner (Mobile)**
   - `Budget_Planner_Mobile.png` ➔ `step_09_Budget_Planner_Mobile.png`

## Gap Analysis (Missing Screens)

Based on the frontend page requirements in `docs/PLAN_CC.md`, the following views currently lack mockups:
- **Authentication:** Login & Register screens (Phase 0).
- **Onboarding Remaining Steps:** Step 2 (Add Account) and Step 3 (Choose Strategy) (Phase 5a).
- **Account Actions:** Create account form (`accounts/new`) and Account detail/transaction history (`accounts/[id]`) (Phase 5b-5g).
- **Refinancing:** Refinancing offers list + add form (`/dashboard/refinancing`) (Phase 5b-5g).
- **Settings:** Profile edit + sign out (`/dashboard/settings`) (Phase 5b-5g).

## Implementation Steps
1. Execute a shell script to rename the files in `docs/images/` to include the `step_<number>_` prefixes based on the mapping above.