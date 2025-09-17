"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import styles from "./DashboardLayout.module.css";
import ReminderBell from "@/components/dashboard/ReminderBell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Students", href: "/students" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navContent}>
            <div className={styles.leftSection}>
              <div className={styles.logo}>
                <div className={styles.logo}>
                  <img
                    src="/logo.png"
                    alt="Undergraduation Logo"
                    className={styles.logoImage}
                  />
                  {/* <span className={styles.title}>Student CRM</span> */}
                </div>
              </div>
              {/* Navigation */}

              <div className={styles.navigation}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${styles.navLink} ${
                      pathname === item.href ? styles.navLinkActive : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.rightSection}>
              <ReminderBell />

              {/* User Avatar + Dropdown */}
              <div className={styles.userMenu}>
                <button
                  className={styles.avatarButton}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <img
                    src={user?.photoURL || "/default-avatar.png"}
                    alt="User Avatar"
                    className={styles.userAvatar}
                  />
                  <span className={styles.dropdownArrow}>▾</span>
                </button>

                {menuOpen && (
                  <div className={styles.dropdownMenu}>
                    <button className={styles.dropdownItem}>Profile</button>
                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.mainInner}>{children}</div>
      </main>
    </div>
  );
}
