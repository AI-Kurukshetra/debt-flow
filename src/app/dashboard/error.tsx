"use client";

import React, { useEffect } from "react";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <h2>Something went wrong!</h2>
      <p>We encountered an unexpected error while loading your dashboard.</p>
      <div className={styles.actions}>
        <button onClick={() => reset()} className={styles.retryBtn}>
          Try Again
        </button>
        <a href="/dashboard" className={styles.homeBtn}>
          Back to Overview
        </a>
      </div>
    </div>
  );
}
