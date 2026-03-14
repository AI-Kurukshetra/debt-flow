"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavLink.module.css";

interface NavLinkProps {
  href: string;
  label: string;
  icon?: string;
}

export function NavLink({ href, label, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link href={href} className={`${styles.link} ${isActive ? styles.active : ""}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}
