// app/admin/profile/page.tsx
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";
import AvatarWithModal from "./AvatarWithModal"; 
import PasswordChangeForm from "./password/PasswordChangeForm";

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const userId = session?.value;

  if (!userId) {
    // middleware で基本ハネるのでここには来ない想定だが念のため
    return (
      <main className={styles.pageRoot}>
        <div className={styles.pageContainer}>
          <div className={styles.messageCard}>
            <p className={styles.messageText}>
              ログイン情報が見つかりません。再度ログインしてください。
            </p>
            <Link href="/admin/login" className={styles.backLinkPrimary}>
              ログイン画面へ戻る
            </Link>
          </div>
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
          <div className={styles.messageCard}>
            <p className={styles.messageText}>
              ユーザー情報が見つかりませんでした。お手数ですが、再度ログインをお試しください。
            </p>
            <Link href="/admin/login" className={styles.backLinkPrimary}>
              ログインし直す
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayName = user.name ?? "名前未設定";
  const initial = displayName.charAt(0);

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        {/* ヘッダー */}
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>プロフィール</h1>
            <p className={styles.pageSubtitle}>
              管理画面アカウントの情報を確認・管理できます。
            </p>
          </div>
          <Link href="/admin" className={styles.backLink}>
            ← 管理者ホームへ戻る
          </Link>
        </header>

        {/* プロフィール表示カード */}
        <section className={styles.profileSection}>
          {/* 上部プロフィール概要 */}
          <div className={styles.profileHeader}>
            {/* ★ アイコン部分：タップでモーダル表示 */}
            <AvatarWithModal
              avatarUrl={user.avatarUrl ?? null}
              initial={initial}
              displayName={displayName}
            />

            <div className={styles.profileMeta}>
              <h2 className={styles.profileName}>{displayName}</h2>
              <div className={styles.metaRow}>
                <span className={styles.roleBadge}>
                  {user.role === "admin" ? "管理者" : user.role}
                </span>
                <span className={styles.metaText}>
                  登録日: {user.createdAt.toLocaleDateString("ja-JP")}
                </span>
              </div>
              <p className={styles.metaHint}>
                ログインIDやロールの変更は、システム管理者のみが行えます。
              </p>
            </div>
          </div>

          {/* 詳細情報 */}
          <dl className={styles.profileList}>
            <div className={styles.profileRow}>
              <dt className={styles.term}>名前</dt>
              <dd className={styles.detail}>{displayName}</dd>
            </div>
            <div className={styles.profileRow}>
              <dt className={styles.term}>ログインID</dt>
              <dd className={styles.detail}>
                {user.loginId ?? "（未設定）"}
              </dd>
            </div>
            <div className={styles.profileRow}>
              <dt className={styles.term}>メールアドレス</dt>
              <dd className={styles.detail}>
                {user.email ?? "（未設定）"}
              </dd>
            </div>
            <div className={styles.profileRow}>
              <dt className={styles.term}>ロール</dt>
              <dd className={styles.detail}>{user.role}</dd>
            </div>
            <div className={styles.profileRow}>
              <dt className={styles.term}>登録日</dt>
              <dd className={styles.detail}>
                {user.createdAt.toLocaleString("ja-JP")}
              </dd>
            </div>
            <div className={styles.profileRow}>
              <dt className={styles.term}>最終更新</dt>
              <dd className={styles.detail}>
                {user.updatedAt.toLocaleString("ja-JP")}
              </dd>
            </div>
          </dl>
        </section>
        <div className={styles.passwordLinkArea}>
          <Link href="/admin/profile/password" className={styles.passwordLink}>
            パスワードを変更する →
          </Link>
        </div>
      </div>
    </main>
  );
}
