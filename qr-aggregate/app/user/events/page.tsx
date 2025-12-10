// app/user/events/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

async function getCurrentParticipantId(): Promise<string> {
  // TODO: ログイン実装に合わせて変更
  return "dummy-participant-id";
}

function generateQrToken(): string {
  const random = crypto.randomUUID();
  return random.replace(/-/g, "");
}

async function joinEvent(formData: FormData) {
  "use server";

  const eventId = formData.get("eventId")?.toString();
  if (!eventId) return;

  const participantId = await getCurrentParticipantId();

  const existing = await prisma.eventAttendee.findFirst({
    where: {
      eventId,
      participantId,
    },
  });

  if (!existing) {
    const qrToken = generateQrToken();
    await prisma.eventAttendee.create({
      data: {
        eventId,
        participantId,
        qrToken,
        status: "registered",
      },
    });
  }

  redirect(`/user/events/${eventId}/qr`);
}

export default async function UserEventsPage() {
  const participantId = await getCurrentParticipantId();

  // ① イベント一覧（例：今日以降のもの）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: today,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // ② 参加状況をまとめて取得
  const attendees = await prisma.eventAttendee.findMany({
    where: {
      participantId,
      eventId: { in: events.map((e) => e.id) },
    },
  });

  const joinedMap = new Map<string, boolean>();
  attendees.forEach((a) => joinedMap.set(a.eventId, true));

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>参加できるイベント一覧</h1>
        </header>

        {events.length === 0 && (
          <p className={styles.emptyMessage}>
            現在、参加可能なイベントはありません。
          </p>
        )}

        {events.length > 0 && (
          <section className={styles.listSection}>
            <ul className={styles.eventList}>
              {events.map((event) => {
                const isJoined = joinedMap.get(event.id) ?? false;

                return (
                  <li key={event.id} className={styles.eventItem}>
                    <div className={styles.eventInfo}>
                      <h2 className={styles.eventTitle}>{event.title}</h2>
                      <p className={styles.eventMeta}>
                        {event.date.toLocaleDateString("ja-JP")}{" "}
                        {event.startAt.toLocaleTimeString("ja-JP", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className={styles.eventActions}>
                      {isJoined ? (
                        <a
                          href={`/user/events/${event.id}/qr`}
                          className={styles.qrLink}
                        >
                          QRコードを表示
                        </a>
                      ) : (
                        <form action={joinEvent}>
                          <input
                            type="hidden"
                            name="eventId"
                            value={event.id}
                          />
                          <button
                            type="submit"
                            className={styles.joinButton}
                          >
                            参加する
                          </button>
                        </form>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
