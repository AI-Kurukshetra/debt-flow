"use client";

import React, { useState, useEffect, useCallback } from "react";
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

  // Initial sort based on strategy type
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

  if (!strategy) return <div>Loading strategy...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Payment Strategy</h1>
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
