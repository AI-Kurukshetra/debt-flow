import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StrategyManager } from "@/components/strategies/strategy-manager";
import styles from "./page.module.css";

export default async function StrategiesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

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
