// app/admin/page.tsx
import Link from "next/link";
import styles from "./page.module.css";

export default async function AdminHomePage() {
  // ★ あとで Prisma に差し替える（ここは仮データ）
  const totalEvents = 3;
  const totalParticipants = 120;
  const totalLogs = 85;
  const attendanceRate = 72;

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        {/* ヘッダー */}
        <header className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerBadge}>
              <span className={styles.badgeIcon}>⚡</span>
              <span>Admin Dashboard</span>
            </div>
            <h1 className={styles.pageTitle}>管理者ホーム</h1>
            <p className={styles.pageSubtitle}>
              イベント管理、参加者情報、出席ログの確認などを一元管理
            </p>
          </div>

          <div className={styles.userArea}>
            <div className={styles.userBadge}>
              <span className={styles.userIcon}>👤</span>
              <span className={styles.userLabel}>Admin</span>
            </div>
          </div>
        </header>

        {/* ★ サマリー可視化エリア */}
        <section className={styles.summarySection}>
          <div className={styles.summaryGrid}>
            {/* メインカード - 出席率 */}
            <div className={styles.summaryMainCard}>
              <div className={styles.summaryCardHeader}>
                <div className={styles.summaryCardIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div>
                  <p className={styles.summaryCardLabel}>全体の出席率</p>
                  <h2 className={styles.summaryCardValue}>{attendanceRate}<span className={styles.summaryUnit}>%</span></h2>
                </div>
              </div>

              <div className={styles.progressBarOuter}>
                <div
                  className={styles.progressBarInner}
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>

              <div className={styles.summaryStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>イベント数</span>
                  <span className={styles.statValue}>{totalEvents}</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>登録参加者</span>
                  <span className={styles.statValue}>{totalParticipants}</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>出席ログ</span>
                  <span className={styles.statValue}>{totalLogs}</span>
                </div>
              </div>
            </div>

            {/* サブ統計カード */}
            <div className={styles.summarySubCards}>
              <div className={styles.summarySubCard}>
                <div className={styles.subCardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className={styles.subCardLabel}>アクティブイベント</p>
                  <p className={styles.subCardValue}>2<span className={styles.subCardUnit}>件</span></p>
                </div>
              </div>

              <div className={styles.summarySubCard}>
                <div className={styles.subCardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <p className={styles.subCardLabel}>今月の新規参加者</p>
                  <p className={styles.subCardValue}>18<span className={styles.subCardUnit}>名</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* メインアクション */}
        <section className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>クイックアクション</h2>
            <p className={styles.sectionSubtitle}>よく使う機能に素早くアクセス</p>
          </div>

          <div className={styles.mainGrid}>
            {/* イベント一覧 */}
            <Link href="/admin/events" className={styles.mainCard}>
              <div className={styles.mainCardGlow} />
              <div className={styles.mainCardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className={styles.mainCardTitle}>イベント一覧</h3>
              <p className={styles.mainCardText}>
                出席を取るイベントの一覧・新規作成・編集・削除
              </p>
              <ul className={styles.mainCardList}>
                <li>登録済みイベントの一覧を確認</li>
                <li>新規イベントの作成</li>
                <li>各イベントのダッシュボードへ遷移</li>
              </ul>
              <div className={styles.mainCardAction}>
                <span>イベント一覧へ</span>
                <span className={styles.actionArrow}>→</span>
              </div>
            </Link>

            {/* 参加者マスタ管理 */}
            <Link href="/admin/participants" className={styles.mainCard}>
              <div className={styles.mainCardGlow} />
              <div className={styles.mainCardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className={styles.mainCardTitle}>参加者マスタ管理</h3>
              <p className={styles.mainCardText}>
                参加者の登録情報を管理
              </p>
              <ul className={styles.mainCardList}>
                <li>学籍番号・氏名・メールアドレス管理</li>
                <li>参加者情報の一括登録・編集</li>
                <li>出席履歴の確認</li>
              </ul>
              <div className={styles.mainCardAction}>
                <span>参加者管理へ</span>
                <span className={styles.actionArrow}>→</span>
              </div>
            </Link>

            {/* プロフィール */}
            <Link href="/admin/profile" className={styles.mainCard}>
              <div className={styles.mainCardGlow} />
              <div className={styles.mainCardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className={styles.mainCardTitle}>プロフィール</h3>
              <p className={styles.mainCardText}>
                管理者アカウントの情報を確認
              </p>
              <ul className={styles.mainCardList}>
                <li>名前・ログインIDを確認</li>
                <li>ロール（admin / staff）を確認</li>
                <li>作成日・更新日を確認</li>
              </ul>
              <div className={styles.mainCardAction}>
                <span>プロフィールへ</span>
                <span className={styles.actionArrow}>→</span>
              </div>
            </Link>
          </div>
        </section>

        {/* データベース管理セクション */}
        <section className={styles.databaseSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>データベース管理</h2>
            <p className={styles.sectionSubtitle}>各種マスタデータの管理と出席ログの確認</p>
          </div>

          <div className={styles.databaseCard}>
            <div className={styles.databaseCardHeader}>
              <div className={styles.databaseIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </div>
              <div>
                <h3 className={styles.databaseCardTitle}>データ管理システム</h3>
                <p className={styles.databaseCardText}>
                  参加者マスタ、イベントマスタ、出席ログなどのデータを管理
                </p>
              </div>
            </div>

            <div className={styles.databaseLinks}>
              <Link href="/admin/participants" className={styles.databaseLink}>
                <div className={styles.databaseLinkIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <p className={styles.databaseLinkTitle}>参加者マスタ管理</p>
                  <p className={styles.databaseLinkDesc}>学籍番号・氏名・メールアドレスなど</p>
                </div>
                <span className={styles.databaseLinkArrow}>→</span>
              </Link>

              <Link href="/admin/events" className={styles.databaseLink}>
                <div className={styles.databaseLinkIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className={styles.databaseLinkTitle}>イベントマスタ管理</p>
                  <p className={styles.databaseLinkDesc}>開催日・開始時刻・遅刻設定など</p>
                </div>
                <span className={styles.databaseLinkArrow}>→</span>
              </Link>

              <div className={styles.databaseLinkDisabled}>
                <div className={styles.databaseLinkIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div>
                  <p className={styles.databaseLinkTitle}>出席ログ検索・CSV エクスポート</p>
                  <p className={styles.databaseLinkDesc}>近日公開予定</p>
                </div>
                <span className={styles.comingSoonBadge}>Coming Soon</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}