import Link from "next/link";
import { redirect } from "next/navigation";
import PasswordAuthForm from "@/components/auth/password-auth-form";
import { getCurrentCustomUser } from "@/lib/auth/custom";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import styles from "../page.module.css";

export default async function RegisterPage() {
  const customUser = await getCurrentCustomUser();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (customUser || user) {
    redirect("/dashboard");
  }

  return (
    <main className={styles.page}>
      <section className={styles.heroPanel}>
        <div className={styles.hero}>
          <span className={styles.badge}>Create Account</span>
          <h1>Start your DebtFlow workspace</h1>
          <p>
            Create your account to begin tracking debt accounts, payment strategies, and your next financial
            milestones.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/login" className={styles.primaryButton}>
              Already have an account
            </Link>
            <Link href="/" className={styles.secondaryButton}>
              Back to home
            </Link>
          </div>
        </div>

        <section className={styles.insightCard}>
          <p className={styles.statLabel}>Signup takes</p>
          <strong className={styles.authHeading}>Username, email, password</strong>
          <p className={styles.subtle}>
            We keep the first step intentionally light so profile and debt details can be completed after account
            creation.
          </p>
        </section>
      </section>

      <section className={styles.authPanel}>
        <section className={styles.card}>
          <span className={styles.badge}>Sign Up</span>
          <h2>Create your DebtFlow account</h2>
          <PasswordAuthForm mode="register" />
        </section>
      </section>
    </main>
  );
}
