import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const future30 = new Date(today);
  future30.setDate(future30.getDate() + 30);

  const todayStr = today.toISOString().split("T")[0];
  const futureStr = future30.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("payment_schedules")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .gte("due_date", todayStr)
    .lte("due_date", futureStr)
    .order("due_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
