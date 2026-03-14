import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PaymentsManager } from "@/components/payments/payments-manager";
import styles from "./page.module.css";

export default async function PaymentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch upcoming payments
  const today = new Date().toISOString().split("T")[0];
  const { data: upcoming } = await supabase
    .from("payment_schedules")
    .select("*, debt_accounts(account_name)")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .gte("due_date", today)
    .order("due_date", { ascending: true });

  // Fetch payment history (transactions)
  const { data: history } = await supabase
    .from("transactions")
    .select("*, debt_accounts(account_name)")
    .eq("user_id", user.id)
    .in("transaction_type", ["payment", "extra_payment"])
    .order("transaction_date", { ascending: false });

  return (
    <div className={styles.page}>
      <PaymentsManager 
        initialUpcoming={upcoming || []} 
        initialHistory={history || []} 
      />
    </div>
  );
}
