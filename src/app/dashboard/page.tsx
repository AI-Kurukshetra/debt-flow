import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import styles from "./page.module.css";
import type { Database } from "@/types/database";
import { DebtProjectionChart } from "@/components/dashboard/debt-projection-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ExportReportBtn } from "@/components/dashboard/export-report-btn";

type DebtAccount = Database["public"]["Tables"]["debt_accounts"]["Row"];

export default async function DashboardPage() {
  const auth = await getAuthenticatedAppContext();
  const user = auth?.user ?? null;

  let accounts: DebtAccount[] = [];

  if (auth) {
    const { supabase } = auth;
    const { data } = await supabase
      .from("debt_accounts")
      .select("*")
      .eq("user_id", auth.user.id)
      .eq("is_active", true)
      .order("current_balance", { ascending: false });
    accounts = (data as DebtAccount[]) ?? [];
  } else {
    // Demo mode: fetch demo accounts using admin client
    const adminClient = createAdminSupabaseClient();
    // Using explicit cast to match Expected Row type
    const { data } = await adminClient
      .from("debt_accounts")
      .select("*")
      .eq("is_demo", true)
      .limit(10);
    accounts = (data as DebtAccount[]) ?? [];
  }

  const totalDebt = accounts.reduce(
    (sum, a) => sum + Number(a.current_balance || 0),
    0
  );
  const totalMinPayment = accounts.reduce(
    (sum, a) => sum + Number(a.minimum_payment || 0),
    0
  );
  const totalOriginal = accounts.reduce(
    (sum, a) => sum + Number(a.original_balance || 0),
    0
  );
  const paidPercent =
    totalOriginal === 0
      ? 0
      : ((totalOriginal - totalDebt) / totalOriginal) * 100;

  return (
    <div className={styles.page}>
      {!user && (
        <div className={styles.demoBanner}>
          <p>
            📊 <strong>Demo Mode</strong> — Sign in to manage your own debts and
            track your progress.
          </p>
        </div>
      )}

      <div className={styles.header}>
        <h1>Dashboard Overview</h1>
        <div className={styles.actions}>
          <ExportReportBtn />
          <button className={styles.primaryButton}>+ New Payment</button>
        </div>
      </div>

      <div className={styles.strip}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Debt</span>
          <span className={styles.statValue}>
            ${totalDebt.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Monthly Minimum</span>
          <span className={styles.statValue}>
            $
            {totalMinPayment.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Progress Paid</span>
          <span className={styles.statValue}>{paidPercent.toFixed(1)}%</span>
          <div className={styles.miniProgress}>
            <div
              className={styles.miniProgressBar}
              style={{ width: `${Math.min(100, Math.max(0, paidPercent))}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.chartSection}>
          <DebtProjectionChart />
        </div>
        <div className={styles.activitySection}>
          <RecentActivity />
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Active Accounts</h2>
          <span className={styles.badge}>{accounts.length} Accounts</span>
        </div>
        <div className={styles.accountGrid}>
          {accounts.map((account) => (
            <div key={account.id} className={styles.accountCard}>
              <div className={styles.accountHeader}>
                <p className={styles.accountName}>{account.account_name}</p>
                <span className={styles.typeBadge}>{account.debt_type}</span>
              </div>
              <p className={styles.accountBalance}>
                $
                {Number(account.current_balance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className={styles.accountMeta}>
                <span>{account.interest_rate}% APR</span>
                <span>Min ${account.minimum_payment}/mo</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
