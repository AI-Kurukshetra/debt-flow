import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createCustomSession } from "@/lib/auth/custom";

type RequestBody = {
  identifier?: string;
  password?: string;
};

type AuthUser = {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
};

export async function POST(request: Request) {
  const { identifier, password } = (await request.json()) as RequestBody;

  if (!identifier || !password) {
    return NextResponse.json({ error: "Username/email and password are required." }, { status: 400 });
  }

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.rpc("authenticate_local_user", {
    p_identifier: identifier,
    p_password: password,
  });

  const user = ((data as AuthUser[] | null) ?? [])[0];

  if (error || !user) {
    return NextResponse.json({ error: "Invalid username/email or password." }, { status: 401 });
  }

  await admin
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", user.id);

  await createCustomSession(user.id);
  return NextResponse.json({ ok: true });
}
