"use client";

import React, { useState } from "react";
import styles from "./PaymentForm.module.css";

interface Account {
  id: string;
  account_name: string;
}

interface PaymentFormData {
  account_id: string;
  transaction_date: string;
  amount: string;
  transaction_type: "payment" | "extra_payment";
  notes: string;
}

interface PaymentFormProps {
  accounts: Account[];
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
}

export function PaymentForm({ accounts, onSubmit, onCancel }: PaymentFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<PaymentFormData>({
    account_id: accounts.length > 0 ? accounts[0].id : "",
    transaction_date: today,
    amount: "",
    transaction_type: "payment",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Account</label>
        <select
          value={formData.account_id}
          onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
          className={styles.select}
          required
        >
          <option value="">Select an account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.account_name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        <div className={styles.formGroup}>
          <label>Payment Date</label>
          <input
            type="date"
            value={formData.transaction_date}
            onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Payment Type</label>
        <select
          value={formData.transaction_type}
          onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as "payment" | "extra_payment" })}
          className={styles.select}
          required
        >
          <option value="payment">Regular Payment</option>
          <option value="extra_payment">Extra Payment</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Notes (Optional)</label>
        <input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g. Made extra payment towards principal"
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.secondaryButton}>
          Cancel
        </button>
        <button type="submit" className={styles.primaryButton}>
          Add Payment
        </button>
      </div>
    </form>
  );
}
