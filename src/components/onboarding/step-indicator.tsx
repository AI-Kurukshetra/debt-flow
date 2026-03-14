import React from "react";
import styles from "./StepIndicator.module.css";

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`${styles.step} ${i + 1 <= current ? styles.active : ""}`}
          />
        ))}
      </div>
      <span className={styles.label}>
        Step {current} of {total}
      </span>
    </div>
  );
}
