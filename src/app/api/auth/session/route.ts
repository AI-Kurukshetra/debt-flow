import { NextResponse } from "next/server";
import { getCurrentCustomUser } from "@/lib/auth/custom";

export async function GET() {
  const user = await getCurrentCustomUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
