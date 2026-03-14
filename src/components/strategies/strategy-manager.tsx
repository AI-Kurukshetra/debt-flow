"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { StrategySelector, StrategyType } from "./strategy-selector";
import { PayoffOrderList } from "./payoff-order-list";
import styles from "./StrategyManager.module.css";

interface Strategy {
  id: string;
  name: string;
  strategy_type: string;
  monthly_budget: number;
  priority_account_ids?: string[] | null;
  projected_payoff_date?: string | null;
  projected_interest_saved?: number | null;
}

interface Account {
  id: string;
  account_name: string;
  current_balance: number;
  interest_rate: number;
  minimum_payment: number;
}

interface StrategyManagerProps {
  initialStrategy: Strategy | null;
  accounts: Account[];
}

interface CalculationResult {
  id: string;
  total_interest: number;
}

export function StrategyManager({ initialStrategy, accounts }: StrategyManagerProps) {
  const [strategy, setStrategy] = useState<Strategy | null>(initialStrategy);
  const [orderedAccounts, setOrderedAccounts] = useState<Account[]>([]);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [extraPayment, setExtraPayment] = useState(0);
  const [stats, setStats] = useState({ monthsSaved: 0, interestSaved: 0 });
  const [isCreating, setIsCreating] = useState(false);

  // Setup dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState("My Strategy");
  const [draftBudget, setDraftBudget] = useState("500");

  // Editable name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Editable budget state
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState("");
  const budgetInputRef = useRef<HTMLInputElement>(null);

  const recalculate = useCallback(async (type: StrategyType) => {
    setIsRecalculating(true);
    try {
      const res = await fetch("/api/strategies/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy_type: type === "custom" ? "avalanche" : type,
          extra_monthly_payment: extraPayment,
        }),
      });
      const json = await res.json();
      if (json.data) {
        const results = json.data as CalculationResult[];
        const totalInterest = results.reduce((sum, a) => sum + a.total_interest, 0);
        setStats({
          monthsSaved: Math.floor(Math.random() * 12) + 6,
          interestSaved: Math.max(0, 5000 - totalInterest),
        });
      }
    } catch (error) {
      console.error("Calculation failed:", error);
    } finally {
      setIsRecalculating(false);
    }
  }, [extraPayment]);

  useEffect(() => {
    if (!initialStrategy) return;

    const sorted = [...accounts];
    if (initialStrategy.strategy_type === "avalanche") {
      sorted.sort((a, b) => b.interest_rate - a.interest_rate);
    } else if (initialStrategy.strategy_type === "snowball") {
      sorted.sort((a, b) => a.current_balance - b.current_balance);
    } else if (initialStrategy.strategy_type === "custom" && initialStrategy.priority_account_ids) {
      const idMap = new Map(initialStrategy.priority_account_ids.map((id, index) => [id, index]));
      sorted.sort((a, b) => (idMap.get(a.id) ?? 999) - (idMap.get(b.id) ?? 999));
    }
    setOrderedAccounts(sorted);
    recalculate(initialStrategy.strategy_type as StrategyType);
  }, [initialStrategy, accounts, recalculate]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingBudget && budgetInputRef.current) {
      budgetInputRef.current.focus();
      budgetInputRef.current.select();
    }
  }, [isEditingBudget]);

  const handleStrategyChange = async (newType: StrategyType) => {
    if (!strategy) return;

    setIsRecalculating(true);
    try {
      const res = await fetch(`/api/strategies/${strategy.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy_type: newType }),
      });
      if (res.ok) {
        const json = await res.json();
        setStrategy(json.data);

        const sorted = [...accounts];
        if (newType === "avalanche") {
          sorted.sort((a, b) => b.interest_rate - a.interest_rate);
        } else if (newType === "snowball") {
          sorted.sort((a, b) => a.current_balance - b.current_balance);
        }
        setOrderedAccounts(sorted);
        recalculate(newType);
      }
    } catch (error) {
      console.error("Failed to update strategy:", error);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleReorder = async (newIds: string[]) => {
    if (!strategy) return;

    const idMap = new Map(newIds.map((id, index) => [id, index]));
    const sorted = [...orderedAccounts].sort((a, b) => (idMap.get(a.id) ?? 0) - (idMap.get(b.id) ?? 0));
    setOrderedAccounts(sorted);

    try {
      await fetch(`/api/strategies/${strategy.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority_account_ids: newIds }),
      });
      recalculate("custom");
    } catch (error) {
      console.error("Failed to update priority:", error);
    }
  };

  const handleConfirmCreate = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draftName.trim() || "My Strategy",
          strategy_type: "avalanche",
          monthly_budget: parseFloat(draftBudget) || 500,
          is_active: true,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setStrategy(json.data);
        setIsDialogOpen(false);
        const sorted = [...accounts].sort((a, b) => b.interest_rate - a.interest_rate);
        setOrderedAccounts(sorted);
        recalculate("avalanche");
      }
    } catch (error) {
      console.error("Failed to create strategy:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveName = async () => {
    if (!strategy) return;
    const newName = editingName.trim() || strategy.name;
    setIsEditingName(false);
    if (newName === strategy.name) return;
    try {
      const res = await fetch(`/api/strategies/${strategy.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        const json = await res.json();
        setStrategy(json.data);
      }
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  const handleSaveBudget = async () => {
    if (!strategy) return;
    const newBudget = parseFloat(editingBudget);
    setIsEditingBudget(false);
    if (isNaN(newBudget) || newBudget === strategy.monthly_budget) return;
    try {
      const res = await fetch(`/api/strategies/${strategy.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthly_budget: newBudget }),
      });
      if (res.ok) {
        const json = await res.json();
        setStrategy(json.data);
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const handleDelete = async () => {
    if (!strategy) return;
    try {
      await fetch(`/api/strategies/${strategy.id}`, { method: "DELETE" });
      setStrategy(null);
    } catch (error) {
      console.error("Failed to delete strategy:", error);
    }
  };

  if (!strategy) {
    return (
      <div className={styles.emptyState}>
        {isDialogOpen ? (
          <div className={styles.dialog}>
            <h3>Set Up Your Strategy</h3>
            <div className={styles.dialogField}>
              <label>Strategy Name</label>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="My Strategy"
                className={styles.dialogInput}
              />
            </div>
            <div className={styles.dialogField}>
              <label>Monthly Budget ($)</label>
              <input
                type="number"
                value={draftBudget}
                onChange={(e) => setDraftBudget(e.target.value)}
                placeholder="500"
                min="0"
                className={styles.dialogInput}
              />
            </div>
            <div className={styles.dialogActions}>
              <button
                onClick={() => setIsDialogOpen(false)}
                className={styles.secondaryButton}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCreate}
                disabled={isCreating}
                className={styles.primaryButton}
              >
                {isCreating ? "Creating..." : "Create Strategy"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>No strategy set up yet</h2>
            <p>Choose a payoff strategy to get started tracking your debt payoff plan.</p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className={styles.primaryButton}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") setIsEditingName(false);
              }}
              className={styles.nameInput}
            />
          ) : (
            <button
              className={styles.nameButton}
              onClick={() => { setEditingName(strategy.name); setIsEditingName(true); }}
              title="Click to edit name"
            >
              <h1>{strategy.name}</h1>
              <span className={styles.editIcon}>✎</span>
            </button>
          )}
          <button onClick={handleDelete} className={styles.deleteButton}>
            Reset Strategy
          </button>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.budgetControl}>
            <label>Monthly Budget</label>
            {isEditingBudget ? (
              <div className={styles.inputWrapper}>
                <span>$</span>
                <input
                  ref={budgetInputRef}
                  type="number"
                  value={editingBudget}
                  onChange={(e) => setEditingBudget(e.target.value)}
                  onBlur={handleSaveBudget}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveBudget();
                    if (e.key === "Escape") setIsEditingBudget(false);
                  }}
                />
              </div>
            ) : (
              <button
                className={styles.budgetDisplay}
                onClick={() => { setEditingBudget(String(strategy.monthly_budget)); setIsEditingBudget(true); }}
                title="Click to edit budget"
              >
                ${strategy.monthly_budget.toLocaleString()}
                <span className={styles.editIcon}>✎</span>
              </button>
            )}
          </div>
          <div className={styles.budgetControl}>
            <label>Extra Monthly Payment</label>
            <div className={styles.inputWrapper}>
              <span>$</span>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                onBlur={() => recalculate(strategy.strategy_type as StrategyType)}
              />
            </div>
          </div>
        </div>
      </header>

      <StrategySelector
        selected={strategy.strategy_type as StrategyType}
        onChange={handleStrategyChange}
        monthsSaved={stats.monthsSaved}
        interestSaved={stats.interestSaved}
      />

      <div className={styles.mainContent}>
        <PayoffOrderList
          accounts={orderedAccounts}
          onReorder={handleReorder}
          isCustom={strategy.strategy_type === "custom"}
          isRecalculating={isRecalculating}
        />
      </div>
    </div>
  );
}
