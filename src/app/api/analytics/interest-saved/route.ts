import { NextResponse } from "next/server";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import type { Database } from "@/types/database";

type DebtAccount = Database["public"]["Tables"]["debt_accounts"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

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

  const { data: accountsRaw, error: accountsError } = await supabase
    .from("debt_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (accountsError) {
    return NextResponse.json({ error: accountsError.message }, { status: 500 });
  }

  const accounts = (accountsRaw ?? []) as DebtAccount[];

  const minimum_total = accounts.reduce((sum, a) => {
    return sum + computeMinimumTotalInterest(
      a.current_balance,
      a.interest_rate,
      a.minimum_payment
    );
  }, 0);

  const { data: transactionsRaw, error: txError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id);

  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 500 });
  }

  const transactions = (transactionsRaw ?? []) as Transaction[];
  const actual_total = transactions.reduce((sum, t) => sum + (t.interest_applied ?? 0), 0);
  const interest_saved = Math.max(0, minimum_total - actual_total);

  return NextResponse.json({ data: { interest_saved, minimum_total, actual_total } });
}
