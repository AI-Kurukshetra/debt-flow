"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SettingsManager.module.css";

interface Profile {
  id: string;
  full_name: string | null;
  employment_type: string | null;
  annual_income: number | null;
}

export function SettingsManager({ initialProfile }: { initialProfile: Profile | null }) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage("Profile updated successfully!");
      }
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/login");
    } catch {
      console.error("Sign out failed");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your account preferences and profile.</p>
      </header>

      <div className={styles.card}>
        <h3>Your Profile</h3>
        <form onSubmit={handleUpdate} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              value={profile?.full_name || ""} 
              onChange={e => setProfile({ ...profile!, full_name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Employment Type</label>
            <select 
              value={profile?.employment_type || ""} 
              onChange={e => setProfile({ ...profile!, employment_type: e.target.value })}
            >
              <option value="employed">Employed</option>
              <option value="self_employed">Self Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Annual Income ($)</label>
            <input 
              type="number" 
              value={profile?.annual_income || 0} 
              onChange={e => setProfile({ ...profile!, annual_income: parseFloat(e.target.value) })}
            />
          </div>
          {message && <p className={styles.message}>{message}</p>}
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h3>Security & Account</h3>
        <p className={styles.dangerZoneText}>Sign out of your session on this device.</p>
        <button onClick={handleSignOut} className={styles.signOutBtn}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
