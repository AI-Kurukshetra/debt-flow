import Link from "next/link";
import { getCurrentCustomUser } from "@/lib/auth/custom";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

type HomeProps = {
  searchParams?: Promise<{ needSignIn?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const customUser = await getCurrentCustomUser();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!(customUser || user);

  return (
    <div className={styles.page}>
      <main className={styles.heroPanel}>
        <section className={styles.hero}>
          <span className={styles.badge}>DebtFlow AI</span>
          <h1>Take Control of Your Financial Future</h1>
          <p>
            DebtFlow is an AI-powered debt optimization platform that helps you
            compare payoff strategies, track loan balances, and visualize your
            path toward financial freedom.
          </p>
          <div className={styles.ctaRow}>
            {isAuthenticated ? (
              <Link href="/dashboard" className={styles.primaryButton}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={styles.primaryButton}>
                  Get Started
                </Link>
                <Link href="/dashboard" className={styles.secondaryButton}>
                  View Demo Dashboard
                </Link>
              </>
            )}
          </div>
          {resolvedSearchParams?.needSignIn && (
            <p className={styles.status}>Please sign in to access that page.</p>
          )}
        </section>

        <section className={styles.insightCard}>
          <div className={styles.statRow}>
            <div>
              <div className={styles.statLabel}>Average Savings</div>
              <div className={styles.statValue}>$4,200+</div>
            </div>
          </div>
          <div className={styles.statRow}>
            <div>
              <div className={styles.statLabel}>Months Saved</div>
              <div className={styles.statValue}>14 Months</div>
            </div>
          </div>
          <div className={styles.statRow}>
            <div>
              <div className={styles.statLabel}>Success Rate</div>
              <div className={styles.statValue}>98%</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
