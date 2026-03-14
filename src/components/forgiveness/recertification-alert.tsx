"use client";

import React from "react";
import styles from "./RecertificationAlert.module.css";

interface RecertificationAlertProps {
  daysRemaining: number;
  onUpdate: () => void;
}

export function RecertificationAlert({ daysRemaining, onUpdate }: RecertificationAlertProps) {
  const isUrgent = daysRemaining <= 30;

  return (
    <div className={`${styles.container} ${isUrgent ? styles.urgent : ""}`}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>
        <div className={styles.title}>IDR Recertification Due Soon</div>
        <p className={styles.body}>
          Your Income-Driven Repayment plan requires annual recertification. 
          Your documentation is due in <strong>{daysRemaining} days</strong>.
        </p>
      </div>
      <button className={styles.actionBtn} onClick={onUpdate}>
        Update Income Details
      </button>
    </div>
  );
}
