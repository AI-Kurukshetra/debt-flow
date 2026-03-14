# Google Stitch UI Generation Prompts

This document contains the sequential prompts designed for Google Stitch to generate the React components for the DebtFlow application. To maintain a consistent design system (colors, typography, component styling), it is highly recommended to execute these prompts **in order within the same Google Stitch chat session**.

---

## 1. The Landing / Login Page (Start Here)
*This establishes the core brand identity, typography, and color palette.*

**Stitch Prompt:**
> Create a modern, trustworthy fintech web application called "DebtFlow". The design should be clean, using a white/light gray background with a primary accent color of deep blue or emerald green.
>
> Design a full-screen Landing/Login page. The layout should be split into two columns:
> - **Left Column (Branding):** A beautifully designed section with a headline "Pay off debt faster with a smarter repayment plan." Include a subtle graphic or illustration representing financial growth or debt reduction.
> - **Right Column (Auth):** A clean authentication card centered on the screen. It should have the title "Sign in to save your plan", a descriptive text "Enter your email to receive a secure one-time code", an email input field, and a primary "Send OTP" button.

---

## 2. The Onboarding Flow (First Time Users)
*This follows immediately after a successful login for a new user.*

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

## 3. The Global Layout & Dashboard Overview (The Hub)
*Once onboarded, the user lands here. This sets up the navigation structure.*

**Stitch Prompt:**
> Using the DebtFlow design system, create the main authenticated Dashboard Layout.
> 
> **Structure:** A persistent left sidebar with navigation links: Overview (active state), Accounts, Strategies, Budget, Forgiveness, Refinance, and Settings at the bottom. A top header showing the user's avatar and a notification bell.
> 
> **Main Content Area (Overview):** 
> 1. A top summary strip with three large metric cards: "Total Debt Balance", "Monthly Minimums", and "Projected Debt-Free Date".
> 2. Below that, a large interactive area chart showing projected debt reduction over time.
> 3. A right-side column or bottom section showing a "Recent Activity" feed (e.g., "Automated payment made to Navient"). 

---

## 4. Debt Accounts List & Detail View
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

## 5. Strategy Builder (Snowball vs Avalanche)
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

## 6. Student Loan Forgiveness Analyzer
*A major differentiating feature from the blueprint.*

**Stitch Prompt:**
> Using the DebtFlow dashboard layout, design the "Loan Forgiveness" tracker.
> 
> **Top Section:** A large, modern circular progress widget showing "PSLF Progress: 84 of 120 Qualifying Payments". 
> 
> **Main Content:** 
> - A section titled "Employer Certification" showing a timeline or list of past submitted ECF forms and their status (Approved, Pending).
> - A warning card titled "Income-Driven Repayment (IDR) Recertification" with an alert banner indicating "Recertification due in 45 days" and a primary action button to "Update Income Details".
