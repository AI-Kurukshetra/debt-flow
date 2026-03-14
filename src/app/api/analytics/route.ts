import { NextResponse } from "next/server";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import type { Database } from "@/types/database";

type DebtAccount = Database["public"]["Tables"]["debt_accounts"]["Row"];

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

  const total_debt = accounts.reduce((sum, a) => sum + a.current_balance, 0);
  const total_min_payment = accounts.reduce((sum, a) => sum + a.minimum_payment, 0);
  const total_original = accounts.reduce((sum, a) => sum + a.original_balance, 0);
  const paid_percent =
    total_original === 0 ? 0 : ((total_original - total_debt) / total_original) * 100;

  const weightedRate =
    total_debt > 0
      ? accounts.reduce((sum, a) => sum + a.current_balance * (a.interest_rate / 100 / 12), 0) /
        total_debt
      : 0;

  let projected_debt_free_date: string | null = null;
  if (total_debt > 0 && total_min_payment > 0) {
    let months: number;
    if (weightedRate === 0) {
      months = total_debt / total_min_payment;
    } else {
      months =
        -Math.log(1 - (total_debt * weightedRate) / total_min_payment) /
        Math.log(1 + weightedRate);
    }
    if (!isFinite(months) || isNaN(months) || months > 600) months = 600;
    const d = new Date();
    d.setMonth(d.getMonth() + Math.ceil(months));
    projected_debt_free_date = d.toISOString().slice(0, 10);
  }

  return NextResponse.json({
    data: { total_debt, total_min_payment, total_original, paid_percent, projected_debt_free_date },
  });
}
