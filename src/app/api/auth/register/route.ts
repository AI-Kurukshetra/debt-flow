import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createCustomSession } from "@/lib/auth/custom";

type RequestBody = {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
};

export async function POST(request: Request) {
  const { username, email, password, fullName } = (await request.json()) as RequestBody;

  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "Username, email, and password are required." },
      { status: 400 },
    );
  }

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.rpc("register_local_user", {
    p_username: username,
    p_email: email,
    p_password: password,
    p_full_name: fullName ?? null,
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Unable to register user." }, { status: 400 });
  }

  await createCustomSession(data as string);
  return NextResponse.json({ ok: true });
}
