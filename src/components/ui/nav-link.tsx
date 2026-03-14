"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./NavLink.module.css";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  const isActive =
    pathname === href ||
    (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`${styles.link}${isActive ? ` ${styles.active}` : ""}`}
    >
      {children}
    </Link>
  );
}
