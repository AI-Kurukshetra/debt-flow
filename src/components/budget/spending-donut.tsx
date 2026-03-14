"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartWrapper } from "@/components/ui/chart-wrapper";
import styles from "./SpendingDonut.module.css";

interface CategoryData {
  name: string;
  spent: number;
  limit: number;
  color: string;
}

interface SpendingDonutProps {
  data: CategoryData[];
}

export function SpendingDonut({ data }: SpendingDonutProps) {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.spent,
    color: item.color,
  }));

  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0);
  const totalLimit = data.reduce((sum, item) => sum + item.limit, 0);
  const percentSpent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return (
    <ChartWrapper title="Budget Utilization" height={300}>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centerLabel}>
          <span className={styles.percent}>{Math.round(percentSpent)}%</span>
          <span className={styles.label}>Spent</span>
        </div>
      </div>
      <div className={styles.legend}>
        {data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <div className={styles.dot} style={{ background: item.color }} />
            <span className={styles.legendName}>{item.name}</span>
            <span className={styles.legendValue}>${item.spent.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </ChartWrapper>
  );
}
