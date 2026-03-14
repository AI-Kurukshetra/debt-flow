import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedAppContext } from "@/lib/auth/server";

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedAppContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { supabase, user } = auth;

  const { searchParams } = new URL(request.url);
  const account_id = searchParams.get("account_id");
  const month = searchParams.get("month");

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false });

  if (account_id) {
    query = query.eq("account_id", account_id);
  }

  if (month) {
    const start = `${month}-01`;
    const [year, mon] = month.split("-").map(Number);
    const nextMonth = mon === 12 ? `${year + 1}-01-01` : `${year}-${String(mon + 1).padStart(2, "0")}-01`;
    query = query.gte("transaction_date", start).lt("transaction_date", nextMonth);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedAppContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { supabase, user } = auth;

  const body = await request.json();
  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}
