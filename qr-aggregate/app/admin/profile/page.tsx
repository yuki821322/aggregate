// app/admin/profile/page.tsx
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const userId = session?.value;

  if (!userId) {
    // middleware で基本ハネるのでここに来ない想定だけど一応
    return (
      <main className={styles.pageRoot}>
        <div className={styles.pageContainer}>
          <p>ログイン情報が見つかりません。再度ログインしてください。</p>
          <Link href="/admin/login" className={styles.backLink}>
            ログイン画面へ
          </Link>
        </div>
      </main>
    );
  }

  const user = await prisma.accountUser.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return (
      <main className={styles.pageRoot}>
        <div className={styles.pageContainer}>
          <p>ユーザー情報が見つかりません。</p>
          <Link href="/admin/login" className={styles.backLink}>
            ログインし直す
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>プロフィール</h1>
          <Link href="/admin" className={styles.backLink}>
            ← 管理者ホームへ戻る
          </Link>
        </header>

        <section className={styles.profileSection}>
          <dl className={styles.profileList}>
            <div className={styles.profileRow}>
              <dt>名前</dt>
              <dd>{user.name}</dd>
            </div>
            <div className={styles.profileRow}>
              <dt>ログインID</dt>
              <dd>{user.loginId ?? "（未設定）"}</dd>
            </div>
            <div className={styles.profileRow}>
              <dt>ロール</dt>
              <dd>{user.role}</dd>
            </div>
            <div className={styles.profileRow}>
              <dt>登録日</dt>
              <dd>{user.createdAt.toLocaleString("ja-JP")}</dd>
            </div>
            <div className={styles.profileRow}>
              <dt>最終更新</dt>
              <dd>{user.updatedAt.toLocaleString("ja-JP")}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
