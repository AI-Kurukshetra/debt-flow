"use client";

import React, { useState } from "react";
import styles from "./CategoryManager.module.css";
import type { Category } from "./budget-manager";

interface CategoryManagerProps {
  initialCategories: Category[];
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
}

export function CategoryManager({ initialCategories, onSubmit, onCancel }: CategoryManagerProps) {
  const [formData, setFormData] = useState({
    category_name: "",
    category_type: "variable_expense",
    budgeted_amount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budgeted_amount: parseFloat(formData.budgeted_amount as string),
      // @ts-expect-error - budget_month is needed by API but not in Category interface yet
      budget_month: new Date().toISOString().split('T')[0].substring(0, 7) + "-01",
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Category Name</label>
          <input
            type="text"
            value={formData.category_name}
            onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
            placeholder="e.g. Groceries, Entertainment"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Type</label>
          <select
            value={formData.category_type}
            onChange={(e) => setFormData({ ...formData, category_type: e.target.value })}
            className={styles.select}
            required
          >
            <option value="income">Income</option>
            <option value="fixed_expense">Fixed Expense</option>
            <option value="variable_expense">Variable Expense</option>
            <option value="debt_payment">Debt Payment</option>
            <option value="savings">Savings</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Monthly Budget ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.budgeted_amount}
            onChange={(e) => setFormData({ ...formData, budgeted_amount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.secondaryButton}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton}>
            Add Category
          </button>
        </div>
      </form>

      <div className={styles.list}>
        <h4>Existing Categories</h4>
        {initialCategories.map((cat) => (
          <div key={cat.id} className={styles.listItem}>
            <span>{cat.category_name}</span>
            <span className={styles.amount}>${Number(cat.budgeted_amount).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
