import { NextRequest, NextResponse } from "next/server";
import { revokeCurrentCustomSession } from "@/lib/auth/custom";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  await revokeCurrentCustomSession();
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), 303);
}
