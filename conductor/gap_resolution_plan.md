# Plan: Gap Resolution — Refinancing, Payments, and Backend Alignment

## Objective
Address the visual and functional gaps identified in the UI audit by updating the generation prompts and the implementation plan. This ensures the backend can support the advanced features seen in the high-fidelity mockups (Refinancing, Payments, PSLF tracking, and Budgeting).

## Proposed Changes

### 1. Update `docs/STITCH_PROMPT.md`
- **Add Prompt 11: Refinancing & Payments Deep Dive**: 
    - Design high-fidelity dashboards for refinancing offer comparisons.
    - Create a detailed payments view with scheduling, history (principal/interest split), and gamification streaks.

### 2. Update `docs/PLAN_CC.md`
- **Add Backend Tasks for New Modules**:
    - **Refinancing API**: `GET /api/refinancing/offers` (logic to filter/match offers based on user debt profiles).
    - **Payments API**: `GET /api/payments/upcoming` (logic for next 30 days of schedules).
    - **Forgiveness Tracking**: Logic for PSLF 84/120 payment calculation and Employer Certification (ECF) status tracking.
    - **Budgeting**: Aggregate logic for "Budget vs Actual" (last 6 months) and "Over Budget" alert triggers.
- **Dependency Management**: Ensure Tier 3 and Tier 4 API routes properly reference the new `refinancing_offers` and `employer_certifications` tables.

### 3. Verification & Testing
- **Schema Validation**: Ensure the `debt_accounts` table has `autopay_enabled` and `is_demo` columns.
- **Route Validation**: Test the logic for the `POST /api/strategies/calculate` endpoint to ensure it correctly identifies the "Snowball" vs "Avalanche" payoff dates.

## Implementation Steps

1.  **Draft Documentation Updates**: Update the `docs/*.md` files with the new prompts and plan steps.
2.  **Schema Refinement**: Verify if additional migrations are needed for `refinancing_offers` and `employer_certifications`.
3.  **API Scaffolding**: Create the route handlers for the new Tier 3/4 endpoints.
