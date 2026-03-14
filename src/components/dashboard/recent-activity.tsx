"use client";

import React, { useEffect, useState } from "react";
import styles from "./RecentActivity.module.css";

interface Notification {
  id: string;
  notification_type: string;
  title: string;
  body: string;
  created_at: string;
}

const TYPE_ICONS: Record<string, string> = {
  payment_due: "📅",
  payment_confirmed: "✅",
  rate_change: "📉",
  milestone: "🏆",
  forgiveness_update: "🎓",
  refinance_alert: "🔄",
  system: "⚙️",
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch("/api/notifications");
        const json = await res.json();
        if (json.data) {
          setActivities(json.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return <div className={styles.loading}>Loading activity...</div>;
  }

  if (activities.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No recent activity yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Activity</h3>
      <div className={styles.list}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.item}>
            <div className={styles.icon}>{TYPE_ICONS[activity.notification_type] || "🔔"}</div>
            <div className={styles.content}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{activity.title}</span>
                <span className={styles.date}>{formatDate(activity.created_at)}</span>
              </div>
              <p className={styles.body}>{activity.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
