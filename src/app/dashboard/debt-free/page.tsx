"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const MOCK_STATS = {
  totalPaid: 42150,
  interestSaved: 5230,
  monthsTaken: 34
};

export default function DebtFreeCelebrationPage() {
  const [stats] = useState(MOCK_STATS);

  useEffect(() => {
    // In a real app, we'd trigger a milestone update here
    fetch("/api/analytics/milestone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestone_type: "debt_free" })
    }).catch(console.error);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.confetti} />
      <div className={styles.container}>
        <div className={styles.icon}>🎉</div>
        <h1>Congratulations!</h1>
        <p className={styles.heroText}>You are officially debt-free.</p>
        
        <div className={styles.summaryCard}>
          <div className={styles.stat}>
            <span className={styles.label}>Total Debt Paid</span>
            <span className={styles.value}>${stats.totalPaid.toLocaleString()}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.label}>Interest Saved</span>
            <span className={styles.value}>${stats.interestSaved.toLocaleString()}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.label}>Journey Time</span>
            <span className={styles.value}>{stats.monthsTaken} Months</span>
          </div>
        </div>

        <div className={styles.actions}>
          <h3>What&apos;s next?</h3>
          <p>Put your extra cash to work by setting a new financial goal.</p>
          <div className={styles.buttonRow}>
            <Link href="/dashboard/goals" className={styles.primaryButton}>
              Set Your Next Goal
            </Link>
            <Link href="/dashboard" className={styles.secondaryButton}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
