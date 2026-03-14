"use client";

import React, { useState } from "react";
import styles from "./TransactionForm.module.css";
import type { Transaction, Category } from "./budget-manager";

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}

export function TransactionForm({ categories, onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    category_id: categories[0]?.id || "",
    transaction_date: new Date().toISOString().split('T')[0],
    notes: "",
    transaction_type: "payment",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Amount ($)</label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
          autoFocus
        />
      </div>

      <div className={styles.formGroup}>
        <label>Category</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className={styles.select}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Date</label>
        <input
          type="date"
          value={formData.transaction_date}
          onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="What was this payment for?"
          rows={3}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.secondaryButton}>
          Cancel
        </button>
        <button type="submit" className={styles.primaryButton}>
          Log Transaction
        </button>
      </div>
    </form>
  );
}
