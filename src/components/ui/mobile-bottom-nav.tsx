"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileBottomNav.module.css";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard/accounts", label: "Accounts", icon: "💳" },
  { href: "/dashboard/strategies", label: "Strategy", icon: "🎯" },
  { href: "/dashboard/budget", label: "Budget", icon: "📊" },
  { href: "/dashboard/forgiveness", label: "PSLF", icon: "🎓" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`${styles.item} ${isActive ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
      <form action="/api/auth/signout" method="post" className={styles.logoutForm}>
        <button type="submit" className={styles.item}>
          <span className={styles.icon}>↩</span>
          <span className={styles.label}>Logout</span>
        </button>
      </form>
    </nav>
  );
}
