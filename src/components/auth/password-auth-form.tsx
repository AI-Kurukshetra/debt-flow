"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./password-auth-form.module.css";

type PasswordAuthFormProps = {
  mode: "login" | "register";
};

export default function PasswordAuthForm({ mode }: PasswordAuthFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      mode === "login"
        ? { identifier: identifier.trim(), password }
        : {
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            password,
          };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError((result as { error?: string }).error ?? "Something went wrong.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <p className={styles.intro}>
        {mode === "login"
          ? "Use your DebtFlow username or email to continue to your workspace."
          : "Create your DebtFlow account in seconds. You can complete the rest of your profile after sign up."}
      </p>

      {mode === "register" ? (
        <>
          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={styles.input}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={loading}
            autoComplete="username"
            required
          />

          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            autoComplete="email"
            required
          />
        </>
      ) : (
        <>
          <label className={styles.label} htmlFor="identifier">
            Username or email
          </label>
          <input
            id="identifier"
            className={styles.input}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            disabled={loading}
            autoComplete="username"
            required
          />
        </>
      )}

      <label className={styles.label} htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        className={styles.input}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={loading}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        minLength={8}
        required
      />

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
      </button>

      {error ? <p className={styles.error}>{error}</p> : null}

      <p className={styles.footer}>
        {mode === "login" ? "New to DebtFlow?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"} className={styles.link}>
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
