import { NextResponse } from "next/server";
import { refreshCurrentCustomSession } from "@/lib/auth/custom";

export async function POST() {
  const user = await refreshCurrentCustomSession();

  if (!user) {
    return NextResponse.json({ error: "Unable to refresh session." }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user });
}
