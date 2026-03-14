import Link from "next/link";
import PasswordAuthForm from "@/components/auth/password-auth-form";
import styles from "../page.module.css";

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.badge}>DebtFlow Register</span>
        <h1>Create a username/password account</h1>
        <p>
          Register a custom DebtFlow account to test the planned username/password flow while the starter app
          continues to support OTP sign-in.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/login" className={styles.primaryButton}>
            Existing user login
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            Back to home
          </Link>
        </div>
      </section>
      <section className={styles.card}>
        <h2>Register</h2>
        <PasswordAuthForm mode="register" />
      </section>
    </main>
  );
}
