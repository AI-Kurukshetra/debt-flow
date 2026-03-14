import { NextResponse } from "next/server";
import { getCurrentAppUser } from "@/lib/auth/server";

export async function GET() {
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
