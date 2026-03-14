import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SettingsManager } from "@/components/settings/settings-manager";
import styles from "./page.module.css";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className={styles.page}>
      <SettingsManager initialProfile={profile} />
    </div>
  );
}
