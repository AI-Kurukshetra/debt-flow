"use client";

import React from "react";
import styles from "./ProgramCard.module.css";

interface Program {
  id: string;
  name: string;
  description: string;
  eligible_loan_types: string[];
  info_url: string;
}

export function ProgramCard({ program }: { program: Program }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{program.name}</h3>
      <p className={styles.description}>{program.description}</p>
      <div className={styles.loanTypes}>
        {program.eligible_loan_types?.map((type, i) => (
          <span key={i} className={styles.badge}>{type}</span>
        ))}
      </div>
      <a 
        href={program.info_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.link}
      >
        Learn More →
      </a>
    </div>
  );
}
