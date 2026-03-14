"use client";

import React, { useState } from "react";
import { PayoffProgressBar } from "./payoff-progress-bar";
import { ClosedAccountsToggle } from "./closed-accounts-toggle";
import { Modal } from "@/components/ui/modal";
import { AccountForm } from "./account-form";
import styles from "./AccountsList.module.css";

export interface Account {
  id: string;
  account_name: string;
  debt_type: string;
  current_balance: number;
  original_balance: number;
  interest_rate: number;
  minimum_payment: number;
  is_active: boolean;
  interest_saved_lifetime: number;
  paid_percent: number;
}

interface AccountsListProps {
  initialAccounts: Account[];
}

export function AccountsList({ initialAccounts }: AccountsListProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isModalOpen, setIsOpen] = useState(false);

  const handleAddAccount = async (data: Partial<Account>) => {
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        const newAccount = {
          ...json.data,
          interest_saved_lifetime: 0,
          paid_percent: 0,
        };
        setAccounts([newAccount, ...accounts]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to add account:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Your Accounts</h1>
          <ClosedAccountsToggle />
        </div>
        <button 
          className={styles.addButton}
          onClick={() => setIsOpen(true)}
        >
          + Add New Account
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Lender / Type</th>
              <th>Interest Rate</th>
              <th>Current Balance</th>
              <th>Payoff Progress</th>
              <th>Interest Saved</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className={!account.is_active ? styles.inactiveRow : ""}>
                <td>
                  <div className={styles.accountInfo}>
                    <span className={styles.name}>{account.account_name}</span>
                    <span className={styles.typeBadge}>{account.debt_type}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.rate}>{account.interest_rate}% APR</span>
                </td>
                <td>
                  <span className={styles.balance}>${Number(account.current_balance).toLocaleString()}</span>
                </td>
                <td className={styles.progressCell}>
                  <PayoffProgressBar 
                    currentBalance={Number(account.current_balance)} 
                    originalBalance={Number(account.original_balance)}
                  />
                </td>
                <td>
                  <span className={styles.savings}>${Number(account.interest_saved_lifetime || 0).toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsOpen(false)} 
        title="Add New Account"
      >
        <AccountForm 
          onSubmit={handleAddAccount} 
          onCancel={() => setIsOpen(false)} 
        />
      </Modal>
    </div>
  );
}
