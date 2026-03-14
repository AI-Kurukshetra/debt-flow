import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for custom auth session cookie
  const customSession = request.cookies.get("debtflow_session");
  
  // Check for standard Supabase auth cookies (starts with sb-)
  const hasSupabaseSession = request.cookies.getAll().some(c => c.name.startsWith("sb-"));

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!customSession && !hasSupabaseSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
