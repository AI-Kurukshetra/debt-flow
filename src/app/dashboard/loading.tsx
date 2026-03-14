"use client";

import React from "react";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonActions} />
      </div>
      <div className={styles.strip}>
        <div className={styles.skeletonStat} />
        <div className={styles.skeletonStat} />
        <div className={styles.skeletonStat} />
      </div>
      <div className={styles.grid}>
        <div className={styles.skeletonChart} />
        <div className={styles.skeletonActivity} />
      </div>
    </div>
  );
}
