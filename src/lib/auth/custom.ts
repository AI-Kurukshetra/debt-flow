import { randomBytes, createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const ACCESS_COOKIE = "debtflow_session";
const REFRESH_COOKIE = "debtflow_refresh";
const ACCESS_TTL_MS = 1000 * 60 * 60 * 24;
const REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export type AppUser = {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  auth_type: "custom";
};

type AuthRow = {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
};

type SessionPayload = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
  familyId: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function makeToken() {
  return randomBytes(32).toString("hex");
}

function toCookieDate(iso: string) {
  return new Date(iso);
}

export async function setCustomAuthCookies(payload: SessionPayload) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE, payload.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: toCookieDate(payload.accessExpiresAt),
  });

  cookieStore.set(REFRESH_COOKIE, payload.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: toCookieDate(payload.refreshExpiresAt),
  });
}

export async function clearCustomAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  cookieStore.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function createCustomSession(userId: string) {
  const admin = createAdminSupabaseClient();
  const headersList = await headers();
  const accessToken = makeToken();
  const refreshToken = makeToken();
  const familyId = randomUUID();
  const accessExpiresAt = new Date(Date.now() + ACCESS_TTL_MS).toISOString();
  const refreshExpiresAt = new Date(Date.now() + REFRESH_TTL_MS).toISOString();
  const userAgent = headersList.get("user-agent");
  const forwardedFor = headersList.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim();

  const { data: session, error: sessionError } = await admin
    .from("user_sessions")
    .insert({
      user_id: userId,
      session_token: hashToken(accessToken),
      device_info: userAgent ? { userAgent } : null,
      ip_address: ipAddress ?? null,
      expires_at: accessExpiresAt,
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    throw new Error(sessionError?.message ?? "Unable to create session.");
  }

  const { error: refreshError } = await admin.from("refresh_tokens").insert({
    user_id: userId,
    session_id: session.id,
    token_hash: hashToken(refreshToken),
    family_id: familyId,
    expires_at: refreshExpiresAt,
  });

  if (refreshError) {
    throw new Error(refreshError.message);
  }

  await setCustomAuthCookies({
    userId,
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
    familyId,
  });
}

export async function getCurrentCustomUser(): Promise<AppUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("user_sessions")
    .select("user_id, expires_at, is_revoked, users!inner(id, username, email, full_name, is_active, is_verified)")
    .eq("session_token", hashToken(accessToken))
    .maybeSingle();

  if (error || !data || data.is_revoked) {
    return null;
  }

  if (new Date(data.expires_at).getTime() <= Date.now()) {
    return null;
  }

  const user = Array.isArray(data.users) ? data.users[0] : data.users;

  if (!user || !user.is_active) {
    return null;
  }

  return {
    ...(user as AuthRow),
    auth_type: "custom",
  };
}

export async function revokeCurrentCustomSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  const admin = createAdminSupabaseClient();

  if (accessToken) {
    await admin
      .from("user_sessions")
      .update({ is_revoked: true })
      .eq("session_token", hashToken(accessToken));
  }

  if (refreshToken) {
    await admin
      .from("refresh_tokens")
      .update({ is_used: true })
      .eq("token_hash", hashToken(refreshToken));
  }

  await clearCustomAuthCookies();
}

export async function refreshCurrentCustomSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return null;
  }

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("refresh_tokens")
    .select("id, user_id, session_id, expires_at, is_used")
    .eq("token_hash", hashToken(refreshToken))
    .maybeSingle();

  if (error || !data || data.is_used) {
    return null;
  }

  if (new Date(data.expires_at).getTime() <= Date.now()) {
    return null;
  }

  await admin.from("refresh_tokens").update({ is_used: true }).eq("id", data.id);

  if (data.session_id) {
    await admin.from("user_sessions").update({ is_revoked: true }).eq("id", data.session_id);
  }

  await createCustomSession(data.user_id);
  return getCurrentCustomUser();
}
