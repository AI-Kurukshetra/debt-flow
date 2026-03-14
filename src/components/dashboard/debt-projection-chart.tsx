"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { ChartWrapper } from "@/components/ui/chart-wrapper";
import styles from "./DebtProjectionChart.module.css";

interface TimelineData {
  month: string;
  estimated_paid: number;
}

export function DebtProjectionChart() {
  const [data, setData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"line" | "area">("area");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/analytics/progress");
        const json = await res.json();
        if (json.data && json.data.timeline) {
          setData(json.data.timeline);
        }
      } catch (error) {
        console.error("Failed to fetch timeline data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <ChartWrapper title="Debt Reduction Projection" height={300}><div className={styles.loading}>Loading chart...</div></ChartWrapper>;
  }

  return (
    <ChartWrapper title="Debt Reduction Projection" height={300}>
      <div className={styles.controls}>
        <button 
          className={`${styles.toggle} ${view === "area" ? styles.active : ""}`}
          onClick={() => setView("area")}
        >
          Area
        </button>
        <button 
          className={`${styles.toggle} ${view === "line" ? styles.active : ""}`}
          onClick={() => setView("line")}
        >
          Line
        </button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        {view === "area" ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Area 
              type="monotone" 
              dataKey="estimated_paid" 
              name="Estimated Paid"
              stroke="var(--accent)" 
              fillOpacity={1} 
              fill="url(#colorPaid)" 
              strokeWidth={3}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Legend verticalAlign="top" align="right" height={36}/>
            <Line 
              type="monotone" 
              dataKey="estimated_paid" 
              name="Estimated Paid"
              stroke="var(--accent)" 
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--accent)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
