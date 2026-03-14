"use client";

import React, { useState } from "react";
import styles from "./RefinancingManager.module.css";

interface Offer {
  id: string;
  lender_name: string;
  offered_rate: number;
  rate_type: string;
  loan_term_months: number;
  estimated_payment: number;
  total_interest_cost: number;
  pre_qualification: boolean;
  apply_url: string;
}

interface RefinancingManagerProps {
  initialOffers: any[];
  currentSummary: { totalDebt: number; weightedRate: number };
}

export function RefinancingManager({ initialOffers, currentSummary }: RefinancingManagerProps) {
  const [offers] = useState<Offer[]>(initialOffers);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Refinancing Options</h1>
        <p>Compare your current portfolio against consolidation offers.</p>
      </header>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h3>Current Portfolio</h3>
          <div className={styles.stat}>
            <span className={styles.label}>Total Balance</span>
            <span className={styles.value}>${currentSummary.totalDebt.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Avg. Interest Rate</span>
            <span className={styles.value}>{currentSummary.weightedRate.toFixed(2)}%</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <h3>Target Optimization</h3>
          <div className={styles.stat}>
            <span className={styles.label}>Potential APR Savings</span>
            <span className={`${styles.value} ${styles.green}`}>
              Up to {(currentSummary.weightedRate - (offers[0]?.offered_rate || 0)).toFixed(2)}%
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Offers Available</span>
            <span className={styles.value}>{offers.length}</span>
          </div>
        </div>
      </div>

      <section className={styles.offersSection}>
        <h2>Recommended Offers</h2>
        <div className={styles.offersGrid}>
          {offers.length === 0 ? (
            <p className={styles.empty}>No refinancing offers found for your profile.</p>
          ) : (
            offers.map(offer => {
              const savings = currentSummary.weightedRate - offer.offered_rate;
              return (
                <div key={offer.id} className={styles.offerCard}>
                  {offer.pre_qualification && <span className={styles.badge}>Pre-Qualified</span>}
                  <div className={styles.lenderName}>{offer.lender_name}</div>
                  <div className={styles.rateInfo}>
                    <div className={styles.rateValue}>{offer.offered_rate}% APR</div>
                    <div className={styles.rateType}>{offer.rate_type} Rate</div>
                  </div>
                  <div className={styles.details}>
                    <div className={styles.detailItem}>
                      <span>Term</span>
                      <span>{offer.loan_term_months / 12} Years</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span>Est. Payment</span>
                      <span>${Number(offer.estimated_payment).toLocaleString()}/mo</span>
                    </div>
                  </div>
                  <div className={styles.savingsHighlight}>
                    Save {savings.toFixed(2)}% APR vs current
                  </div>
                  <a 
                    href={offer.apply_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.applyBtn}
                  >
                    Apply Now
                  </a>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
