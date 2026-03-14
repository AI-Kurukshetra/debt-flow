"use client";

import React from "react";
import styles from "./CircularProgress.module.css";

interface CircularProgressProps {
  current: number;
  total: number;
  label: string;
  subLabel?: string;
}

export function CircularProgress({ current, total, label, subLabel }: CircularProgressProps) {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.container}>
      <div className={styles.progressWrapper}>
        <svg className={styles.svg} width="160" height="160" viewBox="0 0 160 160">
          <circle
            className={styles.background}
            cx="80"
            cy="80"
            r={radius}
            strokeWidth="12"
          />
          <circle
            className={styles.foreground}
            cx="80"
            cy="80"
            r={radius}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className={styles.content}>
          <span className={styles.value}>{current}/{total}</span>
          <span className={styles.unit}>Payments</span>
        </div>
      </div>
      <div className={styles.textInfo}>
        <h3 className={styles.label}>{label}</h3>
        {subLabel && <p className={styles.subLabel}>{subLabel}</p>}
      </div>
    </div>
  );
}
