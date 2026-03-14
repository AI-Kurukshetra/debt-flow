import Link from "next/link";
import { redirect } from "next/navigation";
import PasswordAuthForm from "@/components/auth/password-auth-form";
import { getCurrentCustomUser } from "@/lib/auth/custom";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import styles from "../page.module.css";

type LoginPageProps = {
  searchParams?: Promise<{ needSignIn?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
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
          <span className={styles.badge}>Welcome Back</span>
          <h1>Sign in to continue your DebtFlow plan</h1>
          <p>
            Access your balances, strategy comparisons, and repayment progress from one secure workspace.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/register" className={styles.primaryButton}>
              Create account
            </Link>
            <Link href="/" className={styles.secondaryButton}>
              Back to home
            </Link>
          </div>
        </div>

        <section className={styles.insightCard}>
          <p className={styles.statLabel}>Sign in with</p>
          <strong className={styles.authHeading}>Username or email</strong>
          <p className={styles.subtle}>
            Your account, balances, and repayment progress are securely stored and always up to date.
          </p>
        </section>
      </section>

      <section className={styles.authPanel}>
        <section className={styles.card}>
          <span className={styles.badge}>Login</span>
          <h2>DebtFlow account access</h2>
          {resolvedSearchParams?.needSignIn ? (
            <p className={styles.status}>Sign in required to open your private dashboard.</p>
          ) : null}
          <PasswordAuthForm mode="login" />
        </section>
      </section>
    </main>
  );
}
