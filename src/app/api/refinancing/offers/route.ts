import { NextResponse, NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rate_type = searchParams.get("rate_type");
  const pre_qualification = searchParams.get("pre_qualification");

  let query = supabase
    .from("refinancing_offers")
    .select("*")
    .eq("user_id", user.id)
    .order("offered_rate", { ascending: true });

  if (rate_type) {
    query = query.eq("rate_type", rate_type as "fixed" | "variable");
  }

  if (pre_qualification !== null) {
    query = query.eq("pre_qualification", pre_qualification === "true");
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
