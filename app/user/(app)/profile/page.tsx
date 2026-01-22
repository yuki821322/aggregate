import styles from "./page.module.css";
import { getCurrentParticipant } from "@/lib/auth-participant";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UserProfilePage() {
  const participant = await getCurrentParticipant();

  if (!participant) {
    redirect("/user/login");
  }

  const displayName = participant.name || "名前未設定";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        {/* ヘッダー */}
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>プロフィール</h1>
            <p className={styles.pageSubtitle}>
              アカウント情報を確認・管理できます。
            </p>
          </div>
          <Link href="/user/mypage" className={styles.backLink}>
            ← マイページへ戻る
          </Link>
        </header>

        {/* プロフィール表示カード */}
        <section className={styles.profileSection}>
          {/* 上部プロフィール概要 */}
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitial}>{initial}</span>
            </div>

            <div className={styles.profileMeta}>
              <h2 className={styles.profileName}>{displayName}</h2>
              <div className={styles.metaRow}>
                <span className={styles.roleBadge}>参加者</span>
                <span className={styles.metaText}>
                  登録日: {participant.createdAt.toLocaleDateString("ja-JP")}
                </span>
              </div>
              <p className={styles.metaHint}>
                プロフィール情報はイベント参加時に使用されます。
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
              <dt className={styles.term}>学籍番号</dt>
              <dd className={styles.detail}>
                {participant.studentId || "（未登録）"}
              </dd>
            </div>
            <div className={styles.profileRow}>
              <dt className={styles.term}>登録日</dt>
              <dd className={styles.detail}>
                {participant.createdAt.toLocaleString("ja-JP")}
              </dd>
            </div>
            <div className={styles.profileRow}>
              <dt className={styles.term}>最終更新</dt>
              <dd className={styles.detail}>
                {participant.updatedAt.toLocaleString("ja-JP")}
              </dd>
            </div>
          </dl>
        </section>

        {/* パスワード変更リンク */}
        <div className={styles.passwordLinkArea}>
          <Link href="/user/profile/password" className={styles.passwordLink}>
            パスワードを変更する →
          </Link>
        </div>
      </div>
    </main>
  );
}
