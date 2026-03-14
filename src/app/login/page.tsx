import Link from "next/link";
import PasswordAuthForm from "@/components/auth/password-auth-form";
import styles from "../page.module.css";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.badge}>DebtFlow Login</span>
        <h1>Sign in with username or email</h1>
        <p>
          This custom auth path is designed for product development on top of the starter app. Use one of the
          seeded dev accounts or register a new user.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/register" className={styles.primaryButton}>
            Create account
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            Back to home
          </Link>
        </div>
      </section>
      <section className={styles.card}>
        <h2>Password login</h2>
        <PasswordAuthForm mode="login" />
      </section>
    </main>
  );
}
