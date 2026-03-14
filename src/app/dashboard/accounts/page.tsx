import { AccountsList, Account } from "@/components/accounts/accounts-list";
import styles from "./page.module.css";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getAuthenticatedAppContext } from "@/lib/auth/server";

type DebtAccount = Database["public"]["Tables"]["debt_accounts"]["Row"];

interface AnalyticsAccount {
  id: string;
  interest_saved_lifetime: number;
  paid_percent: number;
}

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ show_closed?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const showClosed = resolvedSearchParams.show_closed === "true";
  
  const auth = await getAuthenticatedAppContext();
  if (!auth) return null;
  const { user, supabase } = auth;

  let query = supabase
    .from("debt_accounts")
    .select("*")
    .eq("user_id", user.id);

  if (!showClosed) {
    query = query.eq("is_active", true);
  }

  const { data: accounts } = await query.order("created_at", { ascending: false });

  // Fetch analytics for interest saved lifetime
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cookieStore = await cookies();
  
  const initialAccounts = (accounts || []) as DebtAccount[];
  let accountsWithAnalytics: Account[] = initialAccounts.map(a => ({ 
    ...a, 
    interest_saved_lifetime: 0, 
    paid_percent: a.original_balance > 0 ? ((a.original_balance - a.current_balance) / a.original_balance) * 100 : 0 
  }));

  try {
    const analyticsRes = await fetch(`${baseUrl}/api/analytics/progress`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    if (analyticsRes.ok) {
      const analyticsJson = await analyticsRes.json();
      const accountsAnalytics = (analyticsJson.data?.accounts || []) as AnalyticsAccount[];

      accountsWithAnalytics = initialAccounts.map(a => {
        const analytic = accountsAnalytics.find((aa) => aa.id === a.id);
        return {
          ...a,
          interest_saved_lifetime: analytic?.interest_saved_lifetime || 0,
          paid_percent: analytic?.paid_percent || (a.original_balance > 0 ? ((a.original_balance - a.current_balance) / a.original_balance) * 100 : 0),
        };
      });
    }
  } catch (error) {
    console.error("Failed to fetch account analytics:", error);
  }

  return (
    <div className={styles.page}>
      <AccountsList initialAccounts={accountsWithAnalytics} />
    </div>
  );
}
