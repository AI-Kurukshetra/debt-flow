"use client";

import { ReactNode } from "react";
import styles from "./ChartWrapper.module.css";

interface ChartWrapperProps {
  title?: string;
  children: ReactNode;
  height?: number;
}

export function ChartWrapper({ title, children, height = 240 }: ChartWrapperProps) {
  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div style={{ height }}>{children}</div>
    </div>
  );
}
