"use client";

import React, { useState } from "react";
import { AccountType, DebtTypeSelect } from "@/components/onboarding/debt-type-select";
import styles from "./AccountForm.module.css";
import type { Account } from "./accounts-list";

interface AccountFormProps {
  initialData?: Partial<Account>;
  onSubmit: (data: Partial<Account> & { payment_due_day?: number | null; rate_type?: string }) => void;
  onCancel: () => void;
}

export function AccountForm({ initialData, onSubmit, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState({
    account_name: initialData?.account_name || "",
    debt_type: (initialData?.debt_type as AccountType) || "" as AccountType | "",
    current_balance: initialData?.current_balance?.toString() || "",
    original_balance: initialData?.original_balance?.toString() || "",
    interest_rate: initialData?.interest_rate?.toString() || "",
    minimum_payment: initialData?.minimum_payment?.toString() || "",
    payment_due_day: "", // This was not in Account type but in DB
    rate_type: "fixed", // This was not in Account type but in DB
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      current_balance: parseFloat(formData.current_balance),
      original_balance: parseFloat(formData.original_balance || formData.current_balance),
      interest_rate: parseFloat(formData.interest_rate),
      minimum_payment: parseFloat(formData.minimum_payment),
      payment_due_day: parseInt(formData.payment_due_day) || null,
      rate_type: formData.rate_type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Lender Name</label>
        <input
          type="text"
          value={formData.account_name}
          onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
          placeholder="e.g. Chase, Navient"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Debt Type</label>
        <DebtTypeSelect
          value={formData.debt_type}
          onChange={(val) => setFormData({ ...formData, debt_type: val })}
          className={styles.select}
        />
      </div>

      <div className={styles.grid}>
        <div className={styles.formGroup}>
          <label>Current Balance ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.current_balance}
            onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Original Balance ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.original_balance}
            onChange={(e) => setFormData({ ...formData, original_balance: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.formGroup}>
          <label>Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={formData.interest_rate}
            onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Rate Type</label>
          <select
            value={formData.rate_type}
            onChange={(e) => setFormData({ ...formData, rate_type: e.target.value })}
            className={styles.select}
          >
            <option value="fixed">Fixed</option>
            <option value="variable">Variable</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.formGroup}>
          <label>Minimum Payment ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.minimum_payment}
            onChange={(e) => setFormData({ ...formData, minimum_payment: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Payment Due Day</label>
          <input
            type="number"
            min="1"
            max="31"
            value={formData.payment_due_day}
            onChange={(e) => setFormData({ ...formData, payment_due_day: e.target.value })}
            placeholder="1-31"
          />
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          Account is active
        </label>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.secondaryButton}>
          Cancel
        </button>
        <button type="submit" className={styles.primaryButton}>
          {initialData?.id ? "Save Changes" : "Add Account"}
        </button>
      </div>
    </form>
  );
}
