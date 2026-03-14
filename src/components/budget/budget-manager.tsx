"use client";

import React, { useState } from "react";
import { SpendingDonut } from "./spending-donut";
import { TransactionForm } from "./transaction-form";
import { CategoryManager } from "./category-manager";
import { Modal } from "@/components/ui/modal";
import styles from "./BudgetManager.module.css";

export interface Category {
  id: string;
  category_name: string;
  category_type: string;
  budgeted_amount: number;
  actual_amount: number;
}

export interface Transaction {
  id: string;
  amount: number;
  category_id: string;
  transaction_date: string;
  notes: string;
}

interface BudgetManagerProps {
  initialCategories: Category[];
  initialTransactions: Transaction[];
  currentMonth: string;
}

const CATEGORY_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export function BudgetManager({ 
  initialCategories, 
  initialTransactions,
  currentMonth 
}: BudgetManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // Map categories for the donut chart
  const donutData = categories.map((cat, index) => ({
    name: cat.category_name,
    spent: transactions
      .filter(t => t.category_id === cat.id)
      .reduce((sum, t) => sum + Number(t.amount), 0),
    limit: Number(cat.budgeted_amount),
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  const handleAddTransaction = async (data: Partial<Transaction>) => {
    // Strip category_id if it's a default placeholder (not a real DB row)
    const realCategoryIds = new Set(categories.map((c) => c.id));
    const payload: Partial<Transaction> & { transaction_type?: string } = { ...data };
    if (payload.category_id && !realCategoryIds.has(payload.category_id)) {
      delete payload.category_id;
    }
    delete payload.transaction_type;
    try {
      const res = await fetch("/api/budget-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        setTransactions([json.data, ...transactions]);
        setIsTxModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  const handleAddCategory = async (data: Partial<Category>) => {
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        setCategories([...categories, json.data]);
        setIsCatModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Budget Planner</h1>
          <p className={styles.month}>{formatMonth(currentMonth)}</p>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.secondaryButton}
            onClick={() => setIsCatModalOpen(true)}
          >
            Manage Categories
          </button>
          <button 
            className={styles.primaryButton}
            onClick={() => setIsTxModalOpen(true)}
          >
            + New Transaction
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.chartCol}>
          <SpendingDonut data={donutData} />
        </div>
        <div className={styles.categoryCol}>
          <div className={styles.card}>
            <h3>Category Breakdown</h3>
            <div className={styles.categoryList}>
              {donutData.map((cat, index) => {
                const isOver = cat.spent > cat.limit;
                const progress = Math.min(100, (cat.spent / cat.limit) * 100);
                return (
                  <div key={index} className={styles.catItem}>
                    <div className={styles.catHeader}>
                      <span className={styles.catName}>{cat.name}</span>
                      <span className={`${styles.catStatus} ${isOver ? styles.over : ""}`}>
                        {isOver ? `Over by $${(cat.spent - cat.limit).toLocaleString()}` : `$${(cat.limit - cat.spent).toLocaleString()} remaining`}
                      </span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div 
                        className={`${styles.progressBar} ${isOver ? styles.progressOver : ""}`} 
                        style={{ width: `${progress}%`, background: isOver ? "#EF4444" : cat.color }} 
                      />
                    </div>
                    <div className={styles.catFooter}>
                      <span>${cat.spent.toLocaleString()} spent</span>
                      <span>${cat.limit.toLocaleString()} budget</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section className={styles.transactions}>
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <h3>Recent Transactions</h3>
            <span className={styles.badge}>{transactions.length} Total</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const cat = categories.find(c => c.id === tx.category_id);
                  return (
                    <tr key={tx.id}>
                      <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                      <td>{tx.notes || "No description"}</td>
                      <td>
                        <span className={styles.tableCatBadge}>
                          {cat?.category_name || "Uncategorized"}
                        </span>
                      </td>
                      <td className={styles.amount}>${Number(tx.amount).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal 
        isOpen={isTxModalOpen} 
        onClose={() => setIsTxModalOpen(false)} 
        title="Log New Transaction"
      >
        <TransactionForm 
          categories={categories} 
          onSubmit={handleAddTransaction} 
          onCancel={() => setIsTxModalOpen(false)} 
        />
      </Modal>

      <Modal 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)} 
        title="Manage Budget Categories"
      >
        <CategoryManager 
          initialCategories={categories} 
          onSubmit={handleAddCategory} 
          onCancel={() => setIsCatModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
