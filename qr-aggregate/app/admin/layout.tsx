// app/admin/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // ★ ログイン / 新規登録ページかどうか判定
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/register";

  // ★ 認証ページは navbar なしでそのまま描画
  if (isAuthPage) {
    return <>{children}</>;
  }

  // ★ それ以外（/admin, /admin/events, /admin/profile, ...）は Navbar 付き
  return (
    <div className={styles.adminRoot}>
      <header className={styles.navbar}>
        <div className={styles.navLeft}>
          <Link href="/admin" className={styles.logo}>
            出席管理 Admin
          </Link>
        </div>
        <nav className={styles.navRight}>
          <Link href="/admin/events" className={styles.navLink}>
            イベント
          </Link>
          <Link href="/admin/profile" className={styles.navLink}>
            プロフィール
          </Link>
          <a href="/api/admin/logout" className={styles.navLogout}>
            ログアウト
          </a>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
