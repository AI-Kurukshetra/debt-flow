import Link from "next/link";
import styles from "./page.module.css";

type HomeProps = {
  searchParams?: Promise<{ needSignIn?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <main className={styles.page}>
      <section className={styles.heroPanel}>
        <div className={styles.hero}>
          <span className={styles.badge}>DebtFlow</span>
          <h1>See every balance. Pick a strategy. Make debt feel beatable.</h1>
          <p>
            DebtFlow gives borrowers a single workspace for balances, payoff strategies, forgiveness progress,
            and repayment momentum.
          </p>
          <p className={styles.subtle}>
            Built on your connected Supabase backend, the experience is now centered on product-ready
            username/password access instead of starter demo messaging.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/register" className={styles.primaryButton}>
              Create your account
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              Sign in
            </Link>
          </div>
        </div>

        <section className={styles.insightCard}>
          <div className={styles.statRow}>
            <div>
              <p className={styles.statLabel}>Track</p>
              <strong>Loans, cards, and payoff progress</strong>
            </div>
            <span className={styles.statValue}>24/7</span>
          </div>
          <div className={styles.statRow}>
            <div>
              <p className={styles.statLabel}>Compare</p>
              <strong>Snowball, avalanche, forgiveness, refinance</strong>
            </div>
            <span className={styles.statValue}>4 paths</span>
          </div>
          <div className={styles.statRow}>
            <div>
              <p className={styles.statLabel}>Prepare</p>
              <strong>Budgets, schedules, and next payment actions</strong>
            </div>
            <span className={styles.statValue}>1 plan</span>
          </div>
        </section>
      </section>

      <section className={styles.authPanel}>
        <div className={styles.card}>
          <span className={styles.badge}>Get Started</span>
          <h2>Open your private repayment workspace</h2>
          <p className={styles.subtle}>
            Sign in to your existing DebtFlow account or create one in a few seconds.
          </p>
          {resolvedSearchParams?.needSignIn ? (
            <p className={styles.status}>Sign in required to open your private dashboard.</p>
          ) : null}
          <div className={styles.authActions}>
            <Link href="/login" className={styles.primaryButton}>
              Go to login
            </Link>
            <Link href="/register" className={styles.secondaryButton}>
              Go to sign up
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.badge}>Preview</span>
          <h2>Want a quick look first?</h2>
          <p className={styles.subtle}>
            Explore the current dashboard workspace to preview the product direction before signing in.
          </p>
          <div className={styles.authActions}>
            <Link href="/dashboard" className={styles.secondaryButton}>
              View dashboard preview
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
