// app/admin/events/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

type EventItem = Awaited<ReturnType<typeof prisma.event.findFirstOrThrow>>;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>イベント一覧</h1>
            <p className={styles.pageSubtitle}>
              イベントを選択するとダッシュボードへ移動します。
            </p>
          </div>

          <Link href="/admin/events/new" className={styles.newEventButton}>
            新規イベント
          </Link>
        </header>

        {events.length === 0 && (
          <p className={styles.emptyMessage}>
            まだイベントが登録されていません。
            「新規イベント」ボタンから作成してみましょう。
          </p>
        )}

        {events.length > 0 && (
          <section className={styles.cardsGrid}>
            {events.map((event: EventItem) => {
              const dateText = event.date.toLocaleDateString("ja-JP");
              const timeText = event.startAt.toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}/dashboard`}
                  className={styles.eventCard}
                >
                  <div className={styles.cardTopRow}>
                    <h2 className={styles.cardTitle}>{event.title}</h2>
                    <span className={styles.cardChevron} aria-hidden>
                      →
                    </span>
                  </div>

                  <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>日付</span>
                      <span className={styles.metaValue}>{dateText}</span>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>開始</span>
                      <span className={styles.metaValue}>{timeText}</span>
                    </div>
                  </div>

                  <div className={styles.locationRow}>
                    <span className={styles.locationLabel}>場所</span>
                    <span className={styles.locationValue}>
                      {event.location?.trim() ? event.location : "-"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
