import { StrategyManager } from "@/components/strategies/strategy-manager";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import styles from "./page.module.css";

export default async function StrategiesPage() {
  const auth = await getAuthenticatedAppContext();
  if (!auth) return null;
  const { user, supabase } = auth;

  // Fetch active strategy
  const { data: activeStrategy } = await supabase
    .from("payment_strategies")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  // Fetch all active accounts
  const { data: accounts } = await supabase
    .from("debt_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("current_balance", { ascending: false });

  return (
    <div className={styles.page}>
      <StrategyManager 
        initialStrategy={activeStrategy} 
        accounts={accounts || []} 
      />
    </div>
  );
}
