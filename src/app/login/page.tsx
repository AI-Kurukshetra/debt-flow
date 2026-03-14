import Link from "next/link";
import PasswordAuthForm from "@/components/auth/password-auth-form";
import styles from "../page.module.css";

export default function LoginPage() {
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
            Your Supabase-connected backend keeps account data, sessions, and future repayment workflows in one place.
          </p>
        </section>
      </section>

      <section className={styles.authPanel}>
        <section className={styles.card}>
          <span className={styles.badge}>Login</span>
          <h2>DebtFlow account access</h2>
          <PasswordAuthForm mode="login" />
        </section>
      </section>
    </main>
  );
}
