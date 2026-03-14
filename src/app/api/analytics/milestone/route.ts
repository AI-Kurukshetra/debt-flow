import { NextResponse } from "next/server";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import type { Database } from "@/types/database";

type DebtAccount = Database["public"]["Tables"]["debt_accounts"]["Row"];
type MilestoneType = "debt_free" | "fifty_percent" | "first_payoff";

export async function POST(request: Request) {
  const auth = await getAuthenticatedAppContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { supabase, user } = auth;

  let body: { milestone_type?: MilestoneType };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { milestone_type } = body;
  if (
    !milestone_type ||
    !["debt_free", "fifty_percent", "first_payoff"].includes(milestone_type)
  ) {
    return NextResponse.json({ error: "Invalid milestone_type" }, { status: 400 });
  }

  const { data: accountsRaw, error } = await supabase
    .from("debt_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const accounts = (accountsRaw ?? []) as DebtAccount[];
  const total_current_balance = accounts.reduce((sum, a) => sum + a.current_balance, 0);
  const is_debt_free = accounts.length === 0 || total_current_balance === 0;

  return NextResponse.json({
    data: {
      milestone_type,
      is_debt_free,
      logged_at: new Date().toISOString(),
    },
  });
}
