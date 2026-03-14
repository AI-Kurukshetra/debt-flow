# Google Stitch UI Generation Prompts

This document contains the sequential prompts designed for Google Stitch to generate the React components for the DebtFlow application. To maintain a consistent design system (colors, typography, component styling), it is highly recommended to execute these prompts **in order within the same Google Stitch chat session**.

---

## 1. The Global Layout & Dashboard Overview (Start Here)
*This establishes the core brand identity, navigation structure, and color palette.*

**Stitch Prompt:**
> Create a modern, trustworthy fintech web application called "DebtFlow". The design should be clean, using a white/light gray background with a primary accent color of deep blue or emerald green.
> 
> **Structure:** A persistent left sidebar with navigation links: Overview (active state), Accounts, Strategies, Budget, Forgiveness, Refinance, and Settings at the bottom. A top header showing the user's avatar and a notification bell.
> 
> **Main Content Area (Overview):** 
> 1. A top summary strip with three large metric cards: "Total Debt Balance", "Monthly Minimums", and "Projected Debt-Free Date".
> 2. Below that, a large interactive area chart showing projected debt reduction over time.
> 3. A right-side column or bottom section showing a "Recent Activity" feed (e.g., "Automated payment made to Navient"). 

---

## 2. The Onboarding Flow (First Time Users)
*This is the data entry flow after a new user registers.*

**Stitch Prompt:**
> Using the established DebtFlow design system, design a distraction-free onboarding screen. Hide any sidebar navigation.
>
> At the very top, include a clean progress indicator showing "Step 1 of 3".
>
> **Main Content:** A centered, clean form card titled "Add your first debt account". 
> Include the following form elements:
> - A dropdown selector for "Debt Type" (Student Loan, Credit Card, Auto, Mortgage).
> - Text inputs for "Lender Name", "Current Balance ($)", "Interest Rate (%)", and "Minimum Monthly Payment ($)".
> - A prominent "Save and Continue" primary button, and a muted "Skip for now" ghost button underneath.

---

## 3. Debt Accounts List & Detail View
*Managing the actual debt records.*

**Stitch Prompt:**
> Using the DebtFlow dashboard layout with the sidebar, design the "Debt Accounts" page.
> 
> **Top of page:** A page title "Your Accounts" and a primary "+ Add New Account" button.
> 
> **Main View:** A list of wide, horizontal cards showing active debts. Each card should display the Lender Name, a small Debt Type badge, the Current Balance, the Interest Rate, and a mini progress bar showing principal paid off.
> 
> **Detail View State:** Design a slide-out side panel that appears when a user clicks on an account. It should show the specific account's details, a "Log a Payment" button, and a table showing recent transaction history for that specific loan.

---

## 4. Strategy Builder (Snowball vs Avalanche)
*The core optimization engine of the app.*

**Stitch Prompt:**
> Using the DebtFlow dashboard layout, design the "Payment Strategy" page.
>
> **Top Section:** An input field asking "How much extra can you pay toward debt each month?" next to a "Recalculate" button.
>
> **Main Content (Comparison):** Two side-by-side comparison pricing-style cards. 
> - **Card 1: Debt Snowball (Lowest Balance First).** Highlight the metric "Months Saved" and "Total Interest Paid".
> - **Card 2: Debt Avalanche (Highest Interest First).** Highlight the metric "Money Saved" and "Total Interest Paid".
> Put a "Select this strategy" button at the bottom of each. One card should have a visual "Active/Selected" state.
> 
> **Bottom Section:** A vertical list showing the exact prioritized order that debts will be paid off based on the selected strategy.

---

## 5. Student Loan Forgiveness Analyzer
*A major differentiating feature from the blueprint.*

**Stitch Prompt:**
> Using the DebtFlow dashboard layout, design the "Loan Forgiveness" tracker.
> 
> **Top Section:** A large, modern circular progress widget showing "PSLF Progress: 84 of 120 Qualifying Payments". 
> 
> **Main Content:** 
> - A section titled "Employer Certification" showing a timeline or list of past submitted ECF forms and their status (Approved, Pending).
> - A warning card titled "Income-Driven Repayment (IDR) Recertification" with an alert banner indicating "Recertification due in 45 days" and a primary action button to "Update Income Details".

---

## UPDATE - V1: Advanced Polish & Missing Modules
*These prompts fill the gaps identified in high-fidelity mockups and the Missing UI audit.*

**Prompt 6: Dashboard Advanced Analytics & Global Actions**
> Polish the "Overview" page. 
> 1. Add an "Export Report" ghost button and a primary "+ New Payment" button in the header area.
> 2. Ensure the "Recent Activity" feed includes visual icons for payment types and a specific "Interest Rate Alert" banner for high-interest loans.
> 3. Add a secondary "Milestone Celebration" popup state for when a debt is fully paid off.

**Prompt 7: Comprehensive Budget & Spending Analysis**
> Design the "Budget" page. 
> 1. **Header:** Month picker (e.g., "October 2023") and "Customize Categories" button.
> 2. **Top Row:** A 50/50 split. Left side: A large donut chart showing % of total budget spent. Right side: A 6-month bar chart comparing "Budget vs Actual".
> 3. **Middle Row:** Category spending cards with progress bars (e.g., "Transport: $200 / $188"). Show a red "OVER BUDGET" state for categories exceeding limits.
> 4. **Bottom Row:** A high-fidelity "Transaction History" table with columns: Date, Description, Category, Amount, and Status. Include a "+ New Transaction" button.
> 5. **Sidebar:** Add an "Upgrade Pro" upsell badge at the bottom of the sidebar.

**Prompt 8: Accounts List - Advanced Polish**
> Refine the "Debt Accounts" page list.
> 1. Add "INTEREST SAVED LIFETIME" and "PAYOFF PROGRESS (%)" columns to the account cards.
> 2. Include a toggle at the top to "View Closed Accounts".
> 3. Ensure each account has a visual badge for its type (Credit Card, Student Loan, etc.).

**Prompt 9: Advanced Forgiveness & ECF Workflow**
> Polish the "Loan Forgiveness" page.
> 1. Add a detailed "Employer Certification" table with columns: Employer Name, Employment Period, Status (Approved/Pending), and Actions (View/Edit).
> 2. Include a "+ Submit New ECF" primary button.
> 3. Add an "Estimated Forgiveness Date" (e.g., "Oct 2027") below the circular progress widget.

**Prompt 10: Mobile Responsive Optimization (Bottom Nav)**
> Design the mobile view (step_09).
> 1. Replace the left sidebar with a bottom navigation bar with icons for: Home, Accounts, Strategies, Budget, and Forgiveness.
> 2. Ensure all charts (donut, area, bar) are responsive and stack vertically.
> 3. Use a floating action button (FAB) for the "+ New Payment" quick action.

**Prompt 11: Refinancing & Payments Deep Dive**
> Design the high-fidelity views for "Refinancing" and "Payments".
> 
> **Refinancing View:** 
> 1. A side-by-side comparison dashboard showing "Current Debt Portfolio" vs "Consolidated Refinance Loan". 
> 2. A list of refinancing offer cards with: Lender Logo/Name, New APR (%), New Monthly Payment, and a high-visibility badge for "Total Lifetime Savings".
> 3. An "Apply Now" primary button and a "Save Offer" ghost button for each.
> 
> **Payments View:**
> 1. A clean "Upcoming Payments" list showing the next 30 days of scheduled transfers, each with a toggle for "Autopay Status".
> 2. A "Payment History" table with columns: Date, Account, Amount, and a "Split View" showing how much went to Principal vs. Interest.
> 3. A visual "Payment Streaks" gamification component at the top (e.g., "6 Month On-Time Streak!").
