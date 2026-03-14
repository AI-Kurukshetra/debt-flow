"use client";

import React from "react";
import styles from "./EcfTable.module.css";

export interface EcfRecord {
  id: string;
  employer_name: string;
  employment_period: string;
  status: "approved" | "pending" | "rejected";
  submission_date: string;
}

interface EcfTableProps {
  records: EcfRecord[];
  onAction: (id: string, action: string) => void;
}

export function EcfTable({ records, onAction }: EcfTableProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved": return styles.approved;
      case "pending": return styles.pending;
      case "rejected": return styles.rejected;
      default: return "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Employer Certification History</h3>
        <button className={styles.addButton} onClick={() => onAction("", "add")}>
          + Submit New ECF
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employer Name</th>
              <th>Certification Period</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>No certification records found.</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td className={styles.employer}>{record.employer_name}</td>
                  <td>{record.employment_period}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{new Date(record.submission_date).toLocaleDateString()}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => onAction(record.id, "view")}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
