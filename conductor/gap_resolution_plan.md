# Plan: Gap Resolution — Phase 5 UI & Interactions

## Objective
Address the visual and functional gaps in the frontend implementation plan (`Phase 5` of `PLAN_CC.md`). This ensures the implemented React components fully match the high-fidelity mockups and business flow requirements (Onboarding, Strategies, Budget, and Forgiveness).

## Proposed Changes

### 1. Update `docs/PLAN_CC.md` — Phase 5 Refinement
The following sub-tasks will be added to the implementation plan:

#### **Onboarding (Task 5a.3)**
- **Strategy Comparison Cards**: Implement Snowball vs. Avalanche selection cards with "Months Saved" and "Total Interest Paid" metrics.
- **Monthly Budget Calculator**: Create a slider/input UI that shows real-time impact on the projected debt-free date.

#### **Strategies (Task 5d.1)**
- **Interactive Reordering**: Add Drag-and-Drop functionality to the `PayoffOrderList` (using `dnd-kit`) to support the "Custom Strategy" flow.
- **Feedback UI**: Show "Live Recalculating" status indicators during list reordering.

#### **Budget (Task 5e.1)**
- **Category Manager**: Add a full "Manage Categories" modal to support adding, deleting, and editing budget category names/limits.
- **Over-Budget States**: Implement red alert visual states for categories exceeding their monthly limit.

#### **Forgiveness (Task 5f.1)**
- **PSLF Data Labels**: Include the "Estimated Forgiveness Date" and "Payments Remaining" labels within the circular progress widget.
- **Status Badges**: Implement color-coded badges (Approved, Pending, Rejected) for the Employer Certification table.

#### **Refinancing (Task 5h.1)**
- **Offer Comparison Grid**: Design cards that highlight "Monthly Savings Delta" and "Lifetime Interest Saved".

### 2. Verification & Testing
- **UI Parity**: Compare every implemented page against the `step_XX` mockups in `docs/images-v1/`.
- **Interaction Check**: Verify that drag-and-drop reordering correctly triggers the `/api/strategies/calculate` endpoint.
- **Responsive Audit**: Ensure the mobile bottom nav (Task 6.3) is functional for all Phase 5 modules.

## Implementation Steps
1.  **Modify `PLAN_CC.md`**: Replace the high-level Phase 5 descriptions with these detailed sub-tasks.
2.  **Schema Sync**: Ensure any new UI fields (like "Months Saved") are supported by the Tier 3/4 API logic.
3.  **Component Scaffolding**: Create the CSS Module templates for the new complex cards (Strategy, Refinance).
