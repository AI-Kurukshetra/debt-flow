import { NextResponse } from "next/server";
import { getAuthenticatedAppContext } from "@/lib/auth/server";

export async function POST(request: Request) {
  const auth = await getAuthenticatedAppContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { supabase, user } = auth;

  const body = await request.json().catch(() => ({}));
  const synced_at = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from("debt_accounts") as any)
    .update({ sync_status: "synced", last_synced_at: synced_at })
    .eq("user_id", user.id);

  if (body.account_id) {
    query = query.eq("id", body.account_id);
  }

  const { data, error } = await query.select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: { synced_count: (data as { id: string }[])?.length ?? 0, synced_at },
  });
}
