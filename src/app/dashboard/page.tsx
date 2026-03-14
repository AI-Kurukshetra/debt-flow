import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import styles from "./page.module.css";

type Account = {
  id: string;
  account_name: string;
  current_balance: number;
  minimum_payment: number;
  interest_rate: number;
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let accounts: Account[] = [];

  if (user) {
    const { data } = await supabase
      .from("debt_accounts")
      .select("id, account_name, current_balance, minimum_payment, interest_rate")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("current_balance", { ascending: false });
    accounts = (data as Account[]) ?? [];
  } else {
    const adminClient = createAdminSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (adminClient.from("debt_accounts") as any)
      .select("*")
      .eq("is_demo", true)
      .limit(10);
    accounts = (data as Account[]) ?? [];
  }

  const totalDebt = accounts.reduce((sum, a) => sum + (a.current_balance ?? 0), 0);
  const totalMinPayment = accounts.reduce((sum, a) => sum + (a.minimum_payment ?? 0), 0);
  const accountCount = accounts.length;

  return (
    <div className={styles.page}>
      {!user && (
        <div className={styles.demoBanner}>
          <p>Demo mode — sign in to access your personal workspace.</p>
        </div>
      )}
      <h1>Overview</h1>
      <div className={styles.strip}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Debt</span>
          <span className={styles.statValue}>${totalDebt.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Monthly Minimum</span>
          <span className={styles.statValue}>${totalMinPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Accounts</span>
          <span className={styles.statValue}>{accountCount}</span>
        </div>
      </div>
      <div className={styles.accountGrid}>
        {accounts.map((account) => (
          <div key={account.id} className={styles.accountCard}>
            <p className={styles.accountName}>{account.account_name}</p>
            <p className={styles.accountBalance}>${account.current_balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            <p className={styles.accountRate}>{account.interest_rate}% APR</p>
          </div>
        ))}
      </div>
    </div>
  );
}
