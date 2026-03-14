"use client";

import React, { useState } from "react";
import styles from "./PaymentsManager.module.css";

interface UpcomingPayment {
  id: string;
  due_date: string;
  amount: number;
  payment_type: string;
  debt_accounts?: { account_name: string };
}

interface PaymentHistory {
  id: string;
  transaction_date: string;
  amount: number;
  principal_applied: number;
  interest_applied: number;
  debt_accounts?: { account_name: string };
}

interface PaymentsManagerProps {
  initialUpcoming: UpcomingPayment[];
  initialHistory: PaymentHistory[];
}

export function PaymentsManager({ initialUpcoming, initialHistory }: PaymentsManagerProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  const upcoming = initialUpcoming;
  const history = initialHistory;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Payments</h1>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "upcoming" ? styles.active : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "history" ? styles.active : ""}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {activeTab === "upcoming" ? (
          <div className={styles.card}>
            <h3>Scheduled Payments</h3>
            <div className={styles.list}>
              {upcoming.length === 0 ? (
                <p className={styles.empty}>No upcoming payments scheduled.</p>
              ) : (
                upcoming.map(payment => (
                  <div key={payment.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{payment.debt_accounts?.account_name}</span>
                      <span className={styles.itemDate}>Due {new Date(payment.due_date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.itemAmount}>
                      <span className={styles.amount}>${Number(payment.amount).toLocaleString()}</span>
                      <span className={styles.typeBadge}>{payment.payment_type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className={styles.card}>
            <h3>Payment History</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Account</th>
                    <th>Total</th>
                    <th>Principal</th>
                    <th>Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.empty}>No payment history found.</td>
                    </tr>
                  ) : (
                    history.map(payment => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.transaction_date).toLocaleDateString()}</td>
                        <td>{payment.debt_accounts?.account_name}</td>
                        <td className={styles.bold}>${Number(payment.amount).toLocaleString()}</td>
                        <td className={styles.principal}>${Number(payment.principal_applied || 0).toLocaleString()}</td>
                        <td className={styles.interest}>${Number(payment.interest_applied || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
