"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { PaymentForm } from "./payment-form";

interface Account {
  id: string;
  account_name: string;
}

interface NewPaymentButtonProps {
  accounts: Account[];
}

export function NewPaymentButton({ accounts }: NewPaymentButtonProps) {
  const [isModalOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: {
    account_id: string;
    transaction_date: string;
    amount: string;
    transaction_type: "payment" | "extra_payment";
    notes: string;
  }) => {
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: data.account_id,
          transaction_date: data.transaction_date,
          amount: parseFloat(data.amount),
          transaction_type: data.transaction_type,
          notes: data.notes || null,
        }),
      });
      if (res.ok) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to add payment:", error);
    }
  };

  if (accounts.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: "var(--accent)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "filter 200ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      >
        + New Payment
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Payment"
      >
        <PaymentForm
          accounts={accounts}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
