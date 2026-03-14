import { BudgetManager } from "@/components/budget/budget-manager";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import styles from "./page.module.css";

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const month = resolvedSearchParams.month || new Date().toISOString().split('T')[0].substring(0, 7);
  
  const auth = await getAuthenticatedAppContext();
  if (!auth) return null;
  const { user, supabase } = auth;

  // Fetch categories for the selected month
  const { data: categories } = await supabase
    .from("budget_categories")
    .select("*")
    .eq("user_id", user.id)
    .eq("budget_month", `${month}-01`);

  // Fetch transactions for the selected month
  const startDate = `${month}-01`;
  const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0).toISOString().split('T')[0];

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate)
    .order("transaction_date", { ascending: false });

  return (
    <div className={styles.page}>
      <BudgetManager 
        initialCategories={categories || []} 
        initialTransactions={transactions || []}
        currentMonth={month}
      />
    </div>
  );
}
