# Executed Recording Steps

This document outlines the exact actions and steps taken during the automated navigation of the DebtFlow application. You can use this as a script to recreate the flow and record your video.

## Initial Setup
- **URL**: `https://debt-flow-beryl.vercel.app/login`
- **Action**: Fill in the login form with the provided dev seed credentials.
  - **Username/Email**: `rajiv_demo@debtflow.dev`
  - **Password**: `DevPass123!`
- **Action**: Click the **"Sign in"** button.

## Scene 2 — Dashboard Overview (1:00–1:45)
- **Wait** for the Dashboard page to load (`/dashboard`).
- **Observe**: 
  - The 3 stat cards: Total Debt, Monthly Minimum, and Progress Paid.
  - The Debt Reduction Projection Chart.
  - The Active Accounts grid at the bottom.

## Scene 3 — Accounts (1:45–2:15)
- **Action**: Click **"💳 Accounts"** in the left sidebar navigation.
- **Wait** for the Accounts List to load.
- **Action**: Click the **"+ Add New Account"** button.
- **Action**: Fill in the Add New Account modal:
  - **Lender Name**: `Chase`
  - **Debt Type**: `Credit Card`
  - **Current Balance ($)**: `4200`
  - **Interest Rate (%)**: `22`
  - **Minimum Payment ($)**: `100`
- **Action**: Click **"Add Account"**.
- **Observe**: The "Chase" account is added to the table and the UI updates.

## Scene 4 — Strategy Manager (2:15–3:15)
- **Action**: Click **"🎯 Strategies"** in the left sidebar navigation.
- **Action**: Rename the active strategy:
  - Click on the strategy name header (e.g., `g-Strategy ✎`).
  - Type `My 2026 Payoff Plan` and press **Enter**.
- **Action**: Adjust the Extra Monthly Payment:
  - Enter `200` into the Extra Monthly Payment input field.
- **Observe**: The "Months Saved" and "Estimated Interest Saved" metrics recalculate, and the Payoff Order reflects the changes.

## Scene 5 — Payments (3:15–3:45)
- **Action**: Click **"📅 Payments"** in the left sidebar navigation.
- **Observe**: The default "Upcoming" scheduled payments view.
- **Action**: Click the **"History"** toggle button.
- **Observe**: The payment history table showing Total, Principal, and Interest splits for past payments.

## Scene 6 — Budget Planner (3:45–4:30)
- **Action**: Click **"📊 Budget"** in the left sidebar navigation.
- **Action**: Click **"Manage Categories"**.
- **Action**: Add a new category in the modal:
  - **Category Name**: `Debt Payment`
  - **Type**: Select `Debt Payment`
  - **Monthly Budget ($)**: `1200`
- **Action**: Click **"Add Category"** and close the modal.
- **Action**: Click **"+ New Transaction"**.
- **Action**: Log a new transaction in the modal:
  - **Amount ($)**: `1200`
  - **Category**: Ensure `Debt Payment` is selected.
  - **Notes (Optional)**: `March Payoff`
- **Action**: Click **"Log Transaction"**.
- **Observe**: The Budget Utilization donut chart hits 100%, and the new transaction appears in the Recent Transactions list.

## Scene 7 — Loan Forgiveness (4:30–5:00)
- **Action**: Click **"🎓 Forgiveness"** in the left sidebar navigation.
- **Observe**: The PSLF circular progress tracker and the IDR Recertification Alert warning.

## Scene 8 — Refinancing (5:00–5:30)
- **Action**: Click **"🔄 Refinancing"** in the left sidebar navigation.
- **Observe**: The "Current Portfolio" stats vs. "Target Optimization" stats, alongside the Recommended Offers section.

## Close — Debt-Free Screen (5:30–6:00)
- **Action**: Navigate directly to `https://debt-flow-beryl.vercel.app/dashboard/debt-free` via the URL bar.
- **Observe**: The celebration confetti, "You are officially debt-free" message, Total Debt Paid, Interest Saved, and Journey Time stats.
- **Action**: Point out the "Set Your Next Goal" CTA button.