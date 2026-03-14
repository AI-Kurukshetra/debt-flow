"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { DebtTypeSelect, AccountType } from "@/components/onboarding/debt-type-select";
import styles from "./page.module.css";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [accountData, setAccountData] = useState({
    account_name: "",
    debt_type: "" as AccountType | "",
    current_balance: "",
    interest_rate: "",
    minimum_payment: "",
    original_balance: "",
  });

  const [strategy, setStrategy] = useState<"snowball" | "avalanche" | "custom">("avalanche");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...accountData,
          current_balance: parseFloat(accountData.current_balance),
          interest_rate: parseFloat(accountData.interest_rate),
          minimum_payment: parseFloat(accountData.minimum_payment),
          original_balance: parseFloat(accountData.original_balance || accountData.current_balance),
        }),
      });

      if (!res.ok) throw new Error("Failed to save account");
      setStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStrategySubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "My Payoff Plan",
          strategy_type: strategy,
          monthly_budget: parseFloat(monthlyBudget || "0") || 1000, // Default if not set yet
          is_active: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to save strategy");
      setStep(3);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Update the profile onboarding step
      const profileRes = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboarding_step: 3 }),
      });

      if (!profileRes.ok) throw new Error("Failed to update profile");

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const skipOnboarding = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <StepIndicator current={step} total={3} />
        </header>

        <main className={styles.card}>
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2>Add your first debt account</h2>
              <p>Let&apos;s start by adding one of your loans or credit cards.</p>
              
              <form onSubmit={handleAccountSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Lender Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Navient, Chase"
                    value={accountData.account_name}
                    onChange={(e) => setAccountData({ ...accountData, account_name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Debt Type</label>
                  <DebtTypeSelect
                    value={accountData.debt_type}
                    onChange={(val) => setAccountData({ ...accountData, debt_type: val })}
                    className={styles.select}
                  />
                </div>

                <div className={styles.grid}>
                  <div className={styles.formGroup}>
                    <label>Current Balance ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={accountData.current_balance}
                      onChange={(e) => setAccountData({ ...accountData, current_balance: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={accountData.interest_rate}
                      onChange={(e) => setAccountData({ ...accountData, interest_rate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Minimum Monthly Payment ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={accountData.minimum_payment}
                    onChange={(e) => setAccountData({ ...accountData, minimum_payment: e.target.value })}
                    required
                  />
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.actions}>
                  <button type="submit" className={styles.primaryButton} disabled={loading}>
                    {loading ? "Saving…" : "Save and Continue"}
                  </button>
                  <button type="button" onClick={skipOnboarding} className={styles.ghostButton}>
                    Skip for now
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <h2>Choose your payoff strategy</h2>
              <p>Select how you&apos;d like to prioritize your debt payments.</p>

              <div className={styles.strategyGrid}>
                <div 
                  className={`${styles.strategyCard} ${strategy === "snowball" ? styles.active : ""}`}
                  onClick={() => setStrategy("snowball")}
                >
                  <div className={styles.strategyIcon}>❄️</div>
                  <h3>Debt Snowball</h3>
                  <p>Pay off smallest balances first for quick psychological wins.</p>
                  <div className={styles.strategyStat}>Speed: Fast</div>
                </div>

                <div 
                  className={`${styles.strategyCard} ${strategy === "avalanche" ? styles.active : ""}`}
                  onClick={() => setStrategy("avalanche")}
                >
                  <div className={styles.strategyIcon}>🌋</div>
                  <h3>Debt Avalanche</h3>
                  <div className={styles.recommended}>Recommended</div>
                  <p>Pay off highest interest rates first to save the most money.</p>
                  <div className={styles.strategyStat}>Savings: Highest</div>
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.actions}>
                <button onClick={handleStrategySubmit} className={styles.primaryButton} disabled={loading}>
                  {loading ? "Saving…" : "Select and Continue"}
                </button>
                <button onClick={() => setStep(1)} className={styles.secondaryButton}>
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <h2>Set your monthly budget</h2>
              <p>How much can you afford to pay toward all your debts combined each month?</p>

              <div className={styles.budgetInputWrapper}>
                <span className={styles.currencyPrefix}>$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className={styles.budgetInput}
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  autoFocus
                />
              </div>

              <p className={styles.hint}>
                Higher monthly payments will significantly reduce your debt-free date and total interest paid.
              </p>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.actions}>
                <button onClick={handleFinalSubmit} className={styles.primaryButton} disabled={loading}>
                  {loading ? "Finishing…" : "Finish Setup"}
                </button>
                <button onClick={() => setStep(2)} className={styles.secondaryButton}>
                  Back
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
