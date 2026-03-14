import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RefinancingManager } from "@/components/refinancing/refinancing-manager";
import styles from "./page.module.css";
import type { Database } from "@/types/database";

type DebtAccount = Database["public"]["Tables"]["debt_accounts"]["Row"];

export default async function RefinancingPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch refinancing offers
  const { data: offers } = await supabase
    .from("refinancing_offers")
    .select("*")
    .eq("user_id", user.id)
    .order("offered_rate", { ascending: true });

  // Fetch current debt summary for comparison
  const { data: accountsRaw } = await supabase
    .from("debt_accounts")
    .select("current_balance, interest_rate")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const accounts = (accountsRaw || []) as Partial<DebtAccount>[];

  const totalDebt = accounts.reduce((sum, a) => sum + Number(a.current_balance || 0), 0);
  const weightedRate = totalDebt > 0 
    ? accounts.reduce((sum, a) => sum + Number(a.current_balance || 0) * (Number(a.interest_rate || 0) / 100), 0) / totalDebt
    : 0;

  return (
    <div className={styles.page}>
      <RefinancingManager 
        initialOffers={offers || []} 
        currentSummary={{ totalDebt, weightedRate: weightedRate * 100 }}
      />
    </div>
  );
}
