// app/admin/AdminShell.tsx
"use client";
import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react"; // ★ 追加
import styles from "./layout.module.css";

export default function AdminShell({
  children,
  displayName,
}: {
  children: ReactNode;
  displayName: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/register";

  if (isAuthPage) return <>{children}</>;

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  // ★ サイドバーが開いている間は body スクロールを止める
  useEffect(() => {
    if (sidebarOpen) {
      // 現在のスクロール位置を保持したいならここで記録してもOK
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className={styles.adminRoot}>
      {/* ===== Navbar ===== */}
      <header className={styles.navbar}>
        <div className={styles.navLeft}>
          <button
            type="button"
            className={`${styles.menuButton} ${
              sidebarOpen ? styles.active : ""
            }`}
            onClick={toggleSidebar}
          >
            <span />
            <span />
            <span />
          </button>

          <Link href="/admin" className={styles.logo}>
            <Image
              src="/user-icon/vantan.svg"
              alt="VANTAN"
              width={50}
              height={50}
              className={styles.logoIcon}
              priority
            />
            <span>出席管理 Admin</span>
          </Link>

        </div>

        <div className={styles.navRight}>
          ようこそ <span className={styles.userName}>{displayName}</span> さん
        </div>
      </header>

      {/* ===== 本体 ===== */}
      <div className={styles.body}>
        {/* サイドバー（オーバーレイ） */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
            
        <nav className={styles.navMenu}>
            <Link
                href="/admin"
                className={styles.navItem}
                onClick={closeSidebar}
            >
                <img src="/admin-icons/home.svg" className={styles.sidebarIcon} />
                ホーム
            </Link>

            <Link
                href="/admin/events"
                className={styles.navItem}
                onClick={closeSidebar}
            >
                <img src="/admin-icons/event.svg" className={styles.sidebarIcon} />
                イベント管理
            </Link>

            <Link
                href="/admin/participants"
                className={styles.navItem}
                onClick={closeSidebar}
            >
                <img src="/admin-icons/participants.svg" className={styles.sidebarIcon} />
                参加者管理
            </Link>

            <Link
                href="/admin/profile"
                className={styles.navItem}
                onClick={closeSidebar}
            >
                <img src="/admin-icons/profile.svg" className={styles.sidebarIcon} />
                プロフィール
            </Link>
        </nav> 

          <div className={styles.sidebarBottom}>
            <a
              href="/api/admin/logout"
              className={styles.navItemDanger}
              onClick={closeSidebar}
            >
              ログアウト
            </a>
          </div>
        </aside>

        {/* 背景クリックで閉じるオーバーレイ */}
        {sidebarOpen && (
          <div
            className={styles.sidebarBackdrop}
            onClick={closeSidebar}
          />
        )}

        {/* メインは常に全幅で固定 */}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
