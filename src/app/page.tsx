import Link from "next/link";
import OtpForm from "@/components/auth/otp-form";
import styles from "./page.module.css";

type HomeProps = {
  searchParams?: Promise<{ needSignIn?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.badge}>DebtFlow</span>
        <h1>Pay off debt faster with a smarter repayment plan</h1>
        <p>
          DebtFlow helps borrowers compare payoff strategies, stay on top of balances, and turn debt reduction
          into a clear path toward financial freedom.
        </p>
        <p className={styles.subtle}>
          Explore the dashboard to preview repayment planning workflows, progress tracking, and a sharable demo
          experience powered by Next.js, Supabase, and Vercel.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/dashboard" className={styles.primaryButton}>
            Open DebtFlow
          </Link>
          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryButton}
          >
            Deploy to Vercel
          </a>
        </div>
      </section>
      <section className={styles.card}>
        <h2>Sign in to save your plan</h2>
        {resolvedSearchParams?.needSignIn ? (
          <p className={styles.status}>Sign in required to open your private dashboard.</p>
        ) : null}
        <OtpForm />
      </section>
    </main>
  );
}
