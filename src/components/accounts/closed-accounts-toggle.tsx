"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import styles from "./ClosedAccountsToggle.module.css";

export function ClosedAccountsToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const showClosed = searchParams.get("show_closed") === "true";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.checked) {
      params.set("show_closed", "true");
    } else {
      params.delete("show_closed");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <label className={styles.container}>
      <input 
        type="checkbox" 
        checked={showClosed} 
        onChange={handleChange} 
      />
      <span>Show closed accounts</span>
    </label>
  );
}
