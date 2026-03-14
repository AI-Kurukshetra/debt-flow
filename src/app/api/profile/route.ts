import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { full_name, employment_type, annual_income, onboarding_step } = body;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (full_name !== undefined) updates.full_name = full_name;
  if (employment_type !== undefined) updates.employment_type = employment_type;
  if (annual_income !== undefined) updates.annual_income = annual_income;
  if (onboarding_step !== undefined) updates.onboarding_step = onboarding_step;

  // Using type casting to bypass the 'never' inference issue with the profiles table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("profiles") as any)
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
