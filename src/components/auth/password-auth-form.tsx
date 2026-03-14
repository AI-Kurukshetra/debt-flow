"use client";

import { FormEvent, useState } from "react";
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
  const [fullName, setFullName] = useState("");
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
            fullName: fullName.trim(),
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
      {mode === "register" ? (
        <>
          <label className={styles.label} htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            className={styles.input}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            disabled={loading}
          />

          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={styles.input}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={loading}
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
        minLength={8}
        required
      />

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
      </button>

      {error ? <p className={styles.error}>{error}</p> : null}
    </form>
  );
}
