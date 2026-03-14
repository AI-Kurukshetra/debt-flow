"use client";

import React, { useState } from "react";
import styles from "./TransactionForm.module.css";
import type { Transaction, Category } from "./budget-manager";

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "housing", category_name: "Housing", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
  { id: "food", category_name: "Food & Dining", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
  { id: "transport", category_name: "Transportation", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
  { id: "utilities", category_name: "Utilities", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
  { id: "healthcare", category_name: "Healthcare", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
  { id: "debt_payment", category_name: "Debt Payment", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
  { id: "entertainment", category_name: "Entertainment", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
  { id: "savings", category_name: "Savings", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
  { id: "income", category_name: "Income", category_type: "income", budgeted_amount: 0, actual_amount: 0 },
  { id: "other", category_name: "Other", category_type: "expense", budgeted_amount: 0, actual_amount: 0 },
];

export function TransactionForm({ categories, onSubmit, onCancel }: TransactionFormProps) {
  const activeCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const [formData, setFormData] = useState({
    amount: "",
    category_id: activeCategories[0]?.id || "",
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
          {activeCategories.map((cat) => (
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
