// app/admin/events/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

// Prisma のメソッドから Event 型を推論する
type EventItem = Awaited<ReturnType<typeof prisma.event.findFirstOrThrow>>;

// ★ Server Action: イベント削除
async function deleteEvent(formData: FormData) {
  "use server";

  const eventId = formData.get("eventId")?.toString() ?? "";
  if (!eventId) return;

  // ここで関連レコード（attendanceLog など）があるなら
  // 先に transaction で消す想定
  await prisma.event.delete({
    where: { id: eventId },
  });

  redirect("/admin/events");
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>イベント一覧</h1>

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
          <section className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.th}>イベント名</th>
                  <th className={styles.th}>日付</th>
                  <th className={styles.th}>開始</th>
                  <th className={styles.th}>操作</th>
                </tr>
              </thead>

              <tbody className={styles.tableBody}>
                {events.map((event: EventItem) => (
                  <tr key={event.id} className={styles.tr}>
                    <td className={styles.td}>{event.title}</td>
                    <td className={styles.td}>
                      {event.date.toLocaleDateString("ja-JP")}
                    </td>
                    <td className={styles.td}>
                      {event.startAt.toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className={styles.tdActions}>
                      <Link
                        href={`/admin/events/${event.id}/dashboard`}
                        className={styles.actionLinkPrimary}
                      >
                        ダッシュボード
                      </Link>

                      <Link
                        href={`/admin/participants?eventId=${event.id}`}
                        className={styles.actionLinkSecondary}
                      >
                        参加者管理
                      </Link>

                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className={styles.editLink}
                      >
                        編集
                      </Link>

                      <form action={deleteEvent} className={styles.inlineForm}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <button type="submit" className={styles.deleteButton}>
                          削除
                        </button>
                      </form>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </main>
  );
}
