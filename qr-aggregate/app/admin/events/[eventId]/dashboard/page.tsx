// app/admin/events/[eventId]/dashboard/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

type DashboardPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function EventDashboardPage({ params }: DashboardPageProps) {
  const { eventId } = await params;

  // イベント情報＋紐づく参加者を取得
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      attendees: true, // 参加者数をカウントする用
    },
  });

  if (!event) {
    return (
      <main className={styles.pageRoot}>
        <div className={styles.pageContainer}>
          <header className={styles.pageHeader}>
            <div className={styles.pageTitleRow}>
              <h1 className={styles.pageTitle}>イベントダッシュボード</h1>
              <Link href="/admin/events" className={styles.backLink}>
                ← イベント一覧へ戻る
              </Link>
            </div>
          </header>

          <div className={styles.notice}>
            <div className={styles.noticeTitle}>イベントが見つかりませんでした。</div>
            <p className={styles.noticeText}>
              URL の <code>eventId</code> が正しいか確認してください。
            </p>
          </div>
        </div>
      </main>
    );
  }

  const attendeeCount = event.attendees.length;

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        {/* ヘッダー */}
        <header className={styles.pageHeader}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>イベントダッシュボード</h1>
            <Link href="/admin/events" className={styles.backLink}>
              ← イベント一覧へ戻る
            </Link>
          </div>

          <div className={styles.eventMeta}>
            <div className={styles.eventTitle}>{event.title}</div>
            <div className={styles.eventSubMeta}>
              <span>
                日付：{event.date.toLocaleDateString("ja-JP")}
              </span>
              <span>
                開始：{event.startAt.toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* サマリーカード */}
        <section className={styles.statSection}>
          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>登録済み参加者</div>
              <div className={styles.statValue}>{attendeeCount} 名</div>
            </div>

            <div className={styles.statCardMuted}>
              <div className={styles.statLabel}>出席人数</div>
              <div className={styles.statValue}>— 名</div>
              <div className={styles.statHint}>※ 出席ログ機能を追加後に表示</div>
            </div>

            <div className={styles.statCardMuted}>
              <div className={styles.statLabel}>出席率</div>
              <div className={styles.statValue}>— %</div>
              <div className={styles.statHint}>※ 集計ロジック実装後に計算</div>
            </div>
          </div>
        </section>

        {/* セクション：今後機能を追加していくエリア */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>最近の出席ログ</h2>
          <div className={styles.placeholderBox}>
            ここに「直近のチェックイン履歴」や「遅刻／早退フラグ」などを表示していきます。
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>集計・グラフ</h2>
          <div className={styles.placeholderBox}>
            ここに出席率の推移グラフや、学年・部署ごとの内訳などを追加予定です。
          </div>
        </section>
      </div>
    </main>
  );
}
