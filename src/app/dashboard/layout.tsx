import NavLink from "@/components/ui/nav-link";
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <NavLink href="/dashboard">Overview</NavLink>
          <NavLink href="/dashboard/accounts">Accounts</NavLink>
          <NavLink href="/dashboard/strategies">Strategies</NavLink>
          <NavLink href="/dashboard/payments">Payments</NavLink>
          <NavLink href="/dashboard/budget">Budget</NavLink>
          <NavLink href="/dashboard/forgiveness">Forgiveness</NavLink>
          <NavLink href="/dashboard/refinancing">Refinancing</NavLink>
          <NavLink href="/dashboard/settings">Settings</NavLink>
        </nav>
        <div className={styles.sidebarFooter} />
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
