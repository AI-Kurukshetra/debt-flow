"use client";

import React from "react";

export type AccountType =
  | "student_federal"
  | "student_private"
  | "credit_card"
  | "mortgage"
  | "personal"
  | "auto"
  | "other";

const LABELS: Record<AccountType, string> = {
  student_federal: "Student Loan (Federal)",
  student_private: "Student Loan (Private)",
  credit_card: "Credit Card",
  mortgage: "Mortgage",
  personal: "Personal Loan",
  auto: "Auto Loan",
  other: "Other",
};

interface DebtTypeSelectProps {
  value: AccountType | "";
  onChange: (value: AccountType) => void;
  className?: string;
}

export function DebtTypeSelect({ value, onChange, className }: DebtTypeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as AccountType)}
      className={className}
      required
    >
      <option value="" disabled>
        Select debt type…
      </option>
      {(Object.keys(LABELS) as AccountType[]).map((type) => (
        <option key={type} value={type}>
          {LABELS[type]}
        </option>
      ))}
    </select>
  );
}
