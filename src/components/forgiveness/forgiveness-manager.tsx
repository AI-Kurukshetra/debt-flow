"use client";

import React, { useState } from "react";
import { CircularProgress } from "./circular-progress";
import { RecertificationAlert } from "./recertification-alert";
import { EcfTable } from "./ecf-table";
import { ProgramCard } from "./program-card";
import styles from "./ForgivenessManager.module.css";

interface Program {
  id: string;
  program_code: string;
  name: string;
  description: string;
  eligible_loan_types: string[];
  info_url: string;
}

interface Tracking {
  id: string;
  program_id: string;
  qualifying_payments: number;
  payments_remaining: number;
  employer_name: string;
  ecf_submission_date: string;
  status: "tracking" | "eligible" | "applied" | "approved" | "not_eligible";
}

interface ForgivenessManagerProps {
  programs: Program[];
  initialTracking: Tracking[];
}

export function ForgivenessManager({ programs, initialTracking }: ForgivenessManagerProps) {
  const [tracking] = useState<Tracking[]>(initialTracking);

  // Focus on PSLF for the progress widget
  const pslfProgram = programs.find(p => p.program_code === "PSLF");
  const pslfTracking = tracking.find(t => t.program_id === pslfProgram?.id);

  const handleEcfAction = (id: string, action: string) => {
    console.log(`Action ${action} on ECF ${id}`);
    // Modal logic for submission would go here
  };

  const handleRecertUpdate = () => {
    console.log("Updating income details");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Student Loan Forgiveness</h1>
        <p>Track your progress toward loan discharge programs.</p>
      </header>

      <div className={styles.topSection}>
        <CircularProgress 
          current={pslfTracking?.qualifying_payments || 0}
          total={120}
          label="PSLF Progress"
          subLabel="Public Service Loan Forgiveness (84 of 120 payments verified)"
        />
      </div>

      <div className={styles.alertSection}>
        <RecertificationAlert 
          daysRemaining={45} 
          onUpdate={handleRecertUpdate} 
        />
      </div>

      <div className={styles.historySection}>
        <EcfTable 
          records={[]} // Mock records for history
          onAction={handleEcfAction}
        />
      </div>

      <section className={styles.programsSection}>
        <h2>Eligible Programs</h2>
        <div className={styles.programGrid}>
          {programs.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>
    </div>
  );
}
