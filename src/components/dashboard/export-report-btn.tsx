"use client";

import React, { useState } from "react";
import styles from "./ExportReportBtn.module.css";
import type { Account } from "@/components/accounts/accounts-list";

export function ExportReportBtn() {
  const [isOpen, setIsOpen] = useState(false);

  const exportCSV = async () => {
    try {
      const res = await fetch("/api/accounts");
      const json = await res.json();
      const accounts = (json.data || []) as Account[];

      if (accounts.length === 0) {
        alert("No accounts to export.");
        return;
      }

      const headers = ["Name", "Type", "Balance", "Interest Rate", "Min Payment"];
      const rows = accounts.map((a) => [
        a.account_name,
        a.debt_type,
        a.current_balance,
        a.interest_rate,
        a.minimum_payment,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `debtflow_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data.");
    } finally {
      setIsOpen(false);
    }
  };

  const exportPDF = () => {
    window.print();
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
      >
        Export Report <span>▾</span>
      </button>
      
      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            <button onClick={exportCSV}>Export as CSV</button>
            <button onClick={exportPDF}>Export as PDF</button>
          </div>
        </>
      )}
    </div>
  );
}
