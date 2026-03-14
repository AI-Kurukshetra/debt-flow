import { SettingsManager } from "@/components/settings/settings-manager";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import styles from "./page.module.css";

export default async function SettingsPage() {
  const auth = await getAuthenticatedAppContext();
  if (!auth) return null;
  const { user, supabase } = auth;

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
