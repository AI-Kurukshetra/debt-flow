import { NavLink } from "@/components/ui/nav-link";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";
import styles from "./layout.module.css";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/accounts", label: "Accounts", icon: "💳" },
  { href: "/dashboard/strategies", label: "Strategies", icon: "🎯" },
  { href: "/dashboard/payments", label: "Payments", icon: "📅" },
  { href: "/dashboard/budget", label: "Budget", icon: "📊" },
  { href: "/dashboard/forgiveness", label: "Forgiveness", icon: "🎓" },
  { href: "/dashboard/refinancing", label: "Refinancing", icon: "🔄" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>DebtFlow</div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.upgradeBadge}>
            <span className={styles.proLabel}>PRO</span>
            <p>Upgrade for bank sync</p>
          </div>
          <form action="/api/auth/signout" method="post" className={styles.logoutForm}>
            <button type="submit" className={styles.logoutButton}>
              Log Out
            </button>
          </form>
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
      <MobileBottomNav />
    </div>
  );
}
