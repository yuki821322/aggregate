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

  // 登録済み参加者数
  const attendeeCount = event.attendees.length;

  // ✅ 最近の出席ログ（20件まで）
  const recentLogs = await prisma.attendanceLog.findMany({
    where: {
      eventAttendee: {
        eventId: event.id,
      },
    },
    orderBy: { checkedAt: "desc" },
    take: 20,
    include: {
      eventAttendee: {
        include: {
          participant: true,
        },
      },
      handledBy: true,
    },
  });

  // ✅ 出席人数（ユニーク参加者数）
  const logsForCount = await prisma.attendanceLog.findMany({
    where: {
      eventAttendee: {
        eventId: event.id,
      },
    },
    select: {
      eventAttendee: {
        select: {
          participantId: true,
        },
      },
    },
  });

  const uniqueParticipantIds = new Set(
    logsForCount.map((log) => log.eventAttendee.participantId)
  );
  const attendedCount = uniqueParticipantIds.size;

  const attendanceRate =
    attendeeCount > 0
      ? Math.round((attendedCount / attendeeCount) * 1000) / 10 // 小数第1位
      : 0;

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        {/* ヘッダー */}
        <header className={styles.pageHeader}>
        <div className={styles.pageTitleRow}>
          <h1 className={styles.pageTitle}>イベントダッシュボード</h1>
          
          <div className={styles.pageHeaderLinks}>
            <Link
              href={`/admin/events/${event.id}/checkin`}
              className={styles.checkinLink}
            >
              出席チェックイン画面へ
            </Link>

            <Link href="/admin/events" className={styles.backLink}>
              ← イベント一覧へ戻る
            </Link>
          </div>
        </div>

        <div className={styles.eventMeta}>
          <div className={styles.eventTitle}>{event.title}</div>
          <div className={styles.eventSubMeta}>
            <span>日付：{event.date.toLocaleDateString("ja-JP")}</span>
            <span>
              開始：
              {event.startAt.toLocaleTimeString("ja-JP", {
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

            <div className={styles.statCard}>
              <div className={styles.statLabel}>出席人数</div>
              <div className={styles.statValue}>{attendedCount} 名</div>
              <div className={styles.statHint}>
                QR コードを読み取ったユニークな参加者数
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>出席率</div>
              <div className={styles.statValue}>{attendanceRate}%</div>
              <div className={styles.statHint}>
                出席人数 ÷ 登録済み参加者 × 100（小数第1位まで）
              </div>
            </div>
          </div>
        </section>

        {/* 最近の出席ログ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>最近の出席ログ</h2>
          {recentLogs.length === 0 ? (
            <div className={styles.placeholderBox}>
              まだ出席ログがありません。QR コードを読み取るとここに履歴が表示されます。
            </div>
          ) : (
            <div className={styles.logList}>
              {recentLogs.map((log) => (
                <div key={log.id} className={styles.logItem}>
                  <div className={styles.logMainRow}>
                    <span className={styles.logName}>
                      {log.eventAttendee.participant?.name ?? "（名前未登録）"}
                    </span>
                    <span className={styles.logStatus}>
                      {log.status === "late"
                        ? "遅刻"
                        : log.status === "too_early"
                        ? "早すぎ"
                        : log.status === "invalid"
                        ? "無効"
                        : "出席"}
                    </span>
                  </div>
                  <div className={styles.logSubRow}>
                    <span className={styles.logTime}>
                      {log.checkedAt.toLocaleString("ja-JP", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {log.eventAttendee.participant?.studentId && (
                      <span className={styles.logCode}>
                        学籍番号: {log.eventAttendee.participant.studentId}
                      </span>
                    )}
                    {log.handledBy && (
                      <span className={styles.logHandledBy}>
                        処理者: {log.handledBy.name ?? "(名前未設定)"}
                      </span>
                    )}
                    {log.deviceLabel && (
                      <span className={styles.logDevice}>
                        端末: {log.deviceLabel}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 集計・グラフ（あとで実装） */}
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
