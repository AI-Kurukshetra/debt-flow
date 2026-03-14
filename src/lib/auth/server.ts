import type { User, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getCurrentCustomUser } from "@/lib/auth/custom";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AppAuthUser = {
  id: string;
  username: string | null;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  auth_type: "custom" | "supabase";
};

export type AppAuthContext = {
  user: AppAuthUser;
  supabase: SupabaseClient<Database>;
  authType: AppAuthUser["auth_type"];
};

function normalizeSupabaseUser(user: User): AppAuthUser {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName = typeof metadata?.full_name === "string" ? metadata.full_name : null;
  const username = typeof metadata?.username === "string"
    ? metadata.username
    : (user.email?.split("@")[0] ?? null);

  return {
    id: user.id,
    username,
    email: user.email ?? "Signed in",
    full_name: fullName,
    is_active: true,
    is_verified: Boolean(user.email_confirmed_at || user.phone_confirmed_at),
    auth_type: "supabase",
  };
}

export async function getCurrentAppUser() {
  const auth = await getAuthenticatedAppContext();
  return auth?.user ?? null;
}

export async function getAuthenticatedAppContext(): Promise<AppAuthContext | null> {
  const customUser = await getCurrentCustomUser();

  if (customUser) {
    return {
      user: customUser,
      supabase: createAdminSupabaseClient() as SupabaseClient<Database>,
      authType: "custom",
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    user: normalizeSupabaseUser(user),
    supabase,
    authType: "supabase",
  };
}
