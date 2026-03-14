import { NextResponse } from "next/server";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import type { Database } from "@/types/database";

type DebtAccount = Database["public"]["Tables"]["debt_accounts"]["Row"];

type TransactionRow = {
  account_id: string | null;
  interest_applied: number | null;
  transaction_type: string | null;
  transaction_date: string;
};

function computeMinimumTotalInterest(
  current_balance: number,
  interest_rate: number,
  minimum_payment: number
): number {
  const monthly_rate = interest_rate / 100 / 12;
  if (monthly_rate === 0) return 0;

  const minInterestPerMonth = current_balance * monthly_rate;
  if (minimum_payment <= minInterestPerMonth) {
    return current_balance * 12 * 30;
  }

  const months =
    -Math.log(1 - (current_balance * monthly_rate) / minimum_payment) /
    Math.log(1 + monthly_rate);

  if (!isFinite(months) || isNaN(months)) {
    return current_balance * 12 * 30;
  }

  return Math.max(0, minimum_payment * months - current_balance);
}

export async function GET() {
  const auth = await getAuthenticatedAppContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { supabase, user } = auth;

  const { data: accountsRaw, error } = await supabase
    .from("debt_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const accounts = (accountsRaw ?? []) as DebtAccount[];

  const { data: txRaw } = await supabase
    .from("transactions")
    .select("account_id, interest_applied, transaction_type, transaction_date")
    .eq("user_id", user.id);

  const transactions = (txRaw ?? []) as TransactionRow[];

  const interestMap = new Map<string, number>();
  const lastPaymentMap = new Map<string, string>();

  for (const tx of transactions) {
    if (!tx.account_id) continue;
    if (tx.interest_applied) {
      interestMap.set(tx.account_id, (interestMap.get(tx.account_id) ?? 0) + tx.interest_applied);
    }
    if (tx.transaction_type === "payment" || tx.transaction_type === "extra_payment") {
      const existing = lastPaymentMap.get(tx.account_id);
      if (!existing || tx.transaction_date > existing) {
        lastPaymentMap.set(tx.account_id, tx.transaction_date);
      }
    }
  }

  const accountBreakdown = accounts.map((a) => ({
    id: a.id,
    account_name: a.account_name,
    current_balance: a.current_balance,
    original_balance: a.original_balance,
    paid_percent:
      a.original_balance === 0
        ? 0
        : ((a.original_balance - a.current_balance) / a.original_balance) * 100,
    interest_saved_lifetime: Math.max(
      0,
      computeMinimumTotalInterest(a.current_balance, a.interest_rate, a.minimum_payment) -
        (interestMap.get(a.id) ?? 0)
    ),
    last_payment_date: lastPaymentMap.get(a.id) ?? null,
  }));

  const total_original = accounts.reduce((sum, a) => sum + a.original_balance, 0);
  const total_current = accounts.reduce((sum, a) => sum + a.current_balance, 0);
  const overall_percent =
    total_original === 0 ? 0 : ((total_original - total_current) / total_original) * 100;

  const totalPaidSoFar = total_original - total_current;
  const now = new Date();
  const timeline = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const estimated_paid = i === 5 ? totalPaidSoFar : (totalPaidSoFar / 5) * i;
    return { month, estimated_paid };
  });

  return NextResponse.json({
    data: { accounts: accountBreakdown, overall_percent, timeline },
  });
}
