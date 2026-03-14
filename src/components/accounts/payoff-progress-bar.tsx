"use client";

import React from "react";
import styles from "./PayoffProgressBar.module.css";

interface PayoffProgressBarProps {
  currentBalance: number;
  originalBalance: number;
  showLabel?: boolean;
}

export function PayoffProgressBar({ 
  currentBalance, 
  originalBalance, 
  showLabel = true 
}: PayoffProgressBarProps) {
  const paidPercent = originalBalance > 0 
    ? Math.min(100, Math.max(0, ((originalBalance - currentBalance) / originalBalance) * 100)) 
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.progressTrack}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${paidPercent}%` }} 
        />
      </div>
      {showLabel && (
        <div className={styles.labels}>
          <span className={styles.percent}>{paidPercent.toFixed(1)}% paid</span>
          <span className={styles.remaining}>${currentBalance.toLocaleString()} left</span>
        </div>
      )}
    </div>
  );
}
