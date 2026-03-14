import { ForgivenessManager } from "@/components/forgiveness/forgiveness-manager";
import { getAuthenticatedAppContext } from "@/lib/auth/server";
import styles from "./page.module.css";

export default async function ForgivenessPage() {
  const auth = await getAuthenticatedAppContext();
  if (!auth) return null;
  const { user, supabase } = auth;

  // Fetch programs
  const { data: programs } = await supabase
    .from("forgiveness_programs")
    .select("*")
    .eq("is_active", true);

  // Fetch tracking data
  const { data: tracking } = await supabase
    .from("user_forgiveness_tracking")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div className={styles.page}>
      <ForgivenessManager 
        programs={programs || []} 
        initialTracking={tracking || []} 
      />
    </div>
  );
}
