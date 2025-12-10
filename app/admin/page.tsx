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
          <div>
            <h1 className={styles.pageTitle}>管理者ホーム</h1>
            <p className={styles.pageSubtitle}>
              出席イベントの作成・管理、参加者情報、出席ログの確認などを行う管理画面です。
            </p>
          </div>

          <div className={styles.userArea}>
            <span className={styles.userLabel}>Admin</span>
          </div>
        </header>

        {/* ★ サマリー可視化エリア */}
        <section className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <span className={styles.summaryTitle}>全体の出席率</span>
              <span className={styles.summaryValue}>{attendanceRate}%</span>
            </div>

            <div className={styles.progressBarOuter}>
              <div
                className={styles.progressBarInner}
                style={{ width: `${attendanceRate}%` }}
              />
            </div>

            <div className={styles.summaryFootRow}>
              <span className={styles.summaryFootItem}>
                イベント数: <strong>{totalEvents}</strong>
              </span>
              <span className={styles.summaryFootItem}>
                登録参加者: <strong>{totalParticipants}</strong> 名
              </span>
              <span className={styles.summaryFootItem}>
                出席ログ: <strong>{totalLogs}</strong> 件
              </span>
            </div>
          </div>
        </section>

        {/* カード群 */}
        <section className={styles.gridSection}>
          {/* イベント一覧（残す） */}
          <Link href="/admin/events" className={styles.cardLink}>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>イベント一覧</h2>
              <p className={styles.cardText}>
                出席を取るイベントの一覧・新規作成・編集・削除を行います。
              </p>
              <ul className={styles.cardList}>
                <li>登録済みイベントの一覧を確認</li>
                <li>新規イベントの作成</li>
                <li>各イベントのダッシュボードへ遷移</li>
              </ul>
              <span className={styles.cardAction}>イベント一覧へ →</span>
            </article>
          </Link>

          {/* データベース管理 */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>データベース管理</h2>
            <p className={styles.cardText}>
              参加者マスタやイベントマスタ、出席ログなどのデータを管理する入口です。
              機能は今後少しずつ追加していきます。
            </p>
            <ul className={styles.cardList}>
              <li>
                <Link href="/admin/participants" className={styles.inlineLink}>
                  参加者マスタ管理
                </Link>{" "}
                （学籍番号・氏名・メールアドレスなど）
              </li>
              <li>
                <Link href="/admin/events" className={styles.inlineLink}>
                  イベントマスタ管理
                </Link>{" "}
                （開催日・開始時刻・遅刻設定など）
              </li>
              <li>将来的に「出席ログ検索・CSV エクスポート」も追加予定</li>
            </ul>
          </article>

          {/* ★ 新規追加：プロフィールカード */}
          <Link href="/admin/profile" className={styles.cardLink}>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>プロフィール</h2>
              <p className={styles.cardText}>
                管理者アカウントの情報を確認できます。（名前・ログインID・権限など）
              </p>
              <ul className={styles.cardList}>
                <li>名前・ログインIDを確認</li>
                <li>ロール（admin / staff）を確認</li>
                <li>作成日・更新日を確認</li>
              </ul>
              <span className={styles.cardAction}>プロフィールへ →</span>
            </article>
          </Link>
        </section>
      </div>
    </main>
  );
}
