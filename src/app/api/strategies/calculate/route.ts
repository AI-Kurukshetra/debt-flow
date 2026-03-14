import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import type { Database } from "@/types/database";

type DebtAccount = Database["public"]["Tables"]["debt_accounts"]["Row"];

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedAppContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { supabase, user } = auth;

  const body = await request.json();
  const { extra_monthly_payment, strategy_type } = body as {
    extra_monthly_payment: number;
    strategy_type: "avalanche" | "snowball";
  };

  const { data: accountsRaw, error } = await supabase
    .from("debt_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const accounts = (accountsRaw ?? []) as DebtAccount[];

  const sorted = [...accounts].sort((a, b) => {
    if (strategy_type === "avalanche") {
      return b.interest_rate - a.interest_rate;
    }
    return a.current_balance - b.current_balance;
  });

  const now = new Date();

  const data = sorted.map((account, index) => {
    const monthly_rate = account.interest_rate / 100 / 12;
    const monthly_payment =
      account.minimum_payment + (index === 0 ? extra_monthly_payment : 0);

    let months_to_payoff: number;
    if (monthly_rate === 0) {
      months_to_payoff = account.current_balance / monthly_payment;
    } else {
      months_to_payoff =
        -Math.log(
          1 - (account.current_balance * monthly_rate) / monthly_payment
        ) / Math.log(1 + monthly_rate);
    }

    months_to_payoff = Math.ceil(months_to_payoff);
    const total_interest = Math.max(
      0,
      monthly_payment * months_to_payoff - account.current_balance
    );

    const payoff_date = new Date(now);
    payoff_date.setMonth(payoff_date.getMonth() + months_to_payoff);

    return {
      id: account.id,
      account_name: account.account_name,
      months_to_payoff,
      total_interest,
      payoff_date: payoff_date.toISOString(),
    };
  });

  return NextResponse.json({ data });
}
