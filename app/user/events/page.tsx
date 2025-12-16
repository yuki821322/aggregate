// app/user/events/page.tsx
export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

// ==============================
// 仮：ログイン実装までの暫定
// ==============================
async function getCurrentParticipantId(): Promise<string> {
  // ローカル開発専用：固定のテスト参加者を自動作成
  const LOGIN_KEY = "local-dev-user";

  let participant = await prisma.participant.findUnique({
    where: { studentId: LOGIN_KEY },
  });

  if (!participant) {
    participant = await prisma.participant.create({
      data: {
        name: "ローカルテストユーザー",
        studentId: LOGIN_KEY,
        passwordHash: "dummy",
      },
    });
  }

  return participant.id;
}


// ==============================
// QRトークン生成
// ==============================
function generateQrToken(): string {
  // node環境でOK（server action内で使う）
  return crypto.randomUUID().replace(/-/g, "");
}

// ==============================
// 参加（server action）
// ==============================
async function joinEvent(formData: FormData) {
  "use server";

  const eventId = formData.get("eventId")?.toString();
  if (!eventId) return;

  const participantId = await getCurrentParticipantId();

  // すでに参加済みなら作らない
  const existing = await prisma.eventAttendee.findFirst({
    where: { eventId, participantId },
    select: { id: true },
  });

  if (!existing) {
    const qrToken = generateQrToken();

    // ※ participantId が実在しないと外部キーで失敗する可能性あり
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

// ==============================
// ページ本体
// ==============================
export default async function UserEventsPage() {
  const participantId = await getCurrentParticipantId();

  // ① イベント一覧（まずは全件表示で切り分け）
  //    ※「今日以降だけ」にしたい場合は、下の where を復活してOK
  const events = await prisma.event.findMany({
    // where: { startAt: { gte: new Date() } }, // ←必要なら後でON
    orderBy: { startAt: "asc" },
  });

  // ② 参加状況をまとめて取得（events が0件でも安全）
  const attendees =
    events.length === 0
      ? []
      : await prisma.eventAttendee.findMany({
          where: {
            participantId,
            eventId: { in: events.map((e) => e.id) },
          },
          select: { eventId: true },
        });

  const joinedSet = new Set(attendees.map((a) => a.eventId));

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>参加できるイベント一覧</h1>
        </header>

        {events.length === 0 && (
          <p className={styles.emptyMessage}>現在、参加可能なイベントはありません。</p>
        )}

        {events.length > 0 && (
          <section className={styles.listSection}>
            <ul className={styles.eventList}>
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/user/events/${event.id}`}
                className={styles.eventItemLink}
              >
                <article className={styles.eventItem}>
                  <div className={styles.eventInfo}>
                    <h2 className={styles.eventTitle}>{event.title}</h2>

                    <p className={styles.eventMeta}>
                      {event.startAt.toLocaleDateString("ja-JP")}{" "}
                      {event.startAt.toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {event.description && (
                      <p className={styles.eventDesc}>{event.description}</p>
                    )}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>

          </section>
        )}
      </div>
    </main>
  );
}
