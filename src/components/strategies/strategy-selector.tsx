"use client";

import React from "react";
import styles from "./StrategySelector.module.css";

export type StrategyType = "snowball" | "avalanche" | "custom";

interface StrategySelectorProps {
  selected: StrategyType;
  onChange: (strategy: StrategyType) => void;
  monthsSaved?: number;
  interestSaved?: number;
}

export function StrategySelector({ 
  selected, 
  onChange, 
  monthsSaved = 0, 
  interestSaved = 0 
}: StrategySelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div 
          className={`${styles.card} ${selected === "snowball" ? styles.active : ""}`}
          onClick={() => onChange("snowball")}
        >
          <div className={styles.icon}>❄️</div>
          <h3>Debt Snowball</h3>
          <p>Pay off smallest balances first for psychological wins.</p>
          <div className={styles.badge}>Speed: Fast</div>
        </div>

        <div 
          className={`${styles.card} ${selected === "avalanche" ? styles.active : ""}`}
          onClick={() => onChange("avalanche")}
        >
          <div className={styles.icon}>🌋</div>
          <h3>Debt Avalanche</h3>
          <div className={styles.recommended}>Recommended</div>
          <p>Pay off highest interest rates first to save most money.</p>
          <div className={styles.badge}>Savings: Highest</div>
        </div>

        <div 
          className={`${styles.card} ${selected === "custom" ? styles.active : ""}`}
          onClick={() => onChange("custom")}
        >
          <div className={styles.icon}>🎯</div>
          <h3>Custom Plan</h3>
          <p>Manually reorder your accounts to fit your specific needs.</p>
          <div className={styles.badge}>Flexibility: Max</div>
        </div>
      </div>

      <div className={styles.comparisonStrip}>
        <div className={styles.compStat}>
          <span className={styles.compLabel}>Months Saved</span>
          <span className={styles.compValue}>{monthsSaved} Months</span>
        </div>
        <div className={styles.compDivider} />
        <div className={styles.compStat}>
          <span className={styles.compLabel}>Estimated Interest Saved</span>
          <span className={styles.compValue}>${interestSaved.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
