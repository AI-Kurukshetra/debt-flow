import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const { data: strategy, error: fetchError } = await supabase
    .from("payment_strategies")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !strategy) {
    return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
  }

  // Deactivate all user strategies
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: deactivateError } = await (supabase.from("payment_strategies") as any)
    .update({ is_active: false })
    .eq("user_id", user.id);

  if (deactivateError) {
    return NextResponse.json({ error: deactivateError.message }, { status: 500 });
  }

  // Activate the target strategy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("payment_strategies") as any)
    .update({ is_active: true })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
