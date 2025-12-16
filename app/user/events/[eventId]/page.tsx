import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

// ローカル用 participant
async function getCurrentParticipantId(): Promise<string> {
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

function generateQrToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

async function joinEvent(formData: FormData) {
  "use server";

  const eventId = formData.get("eventId")?.toString();
  if (!eventId) return;

  const participantId = await getCurrentParticipantId();

  const existing = await prisma.eventAttendee.findFirst({
    where: { eventId, participantId },
  });

  if (!existing) {
    await prisma.eventAttendee.create({
      data: {
        eventId,
        participantId,
        qrToken: generateQrToken(),
        status: "registered",
      },
    });
  }

  redirect(`/user/events/${eventId}/qr`);
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: { attendees: true },
      },
    },
  });

  if (!event) {
    return <p>イベントが見つかりません</p>;
  }

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>{event.title}</h1>

        {/* 日時 */}
        <p className={styles.meta}>
          {event.startAt.toLocaleDateString("ja-JP")}{" "}
          {event.startAt.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          〜{" "}
          {event.endAt.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* 参加人数 */}
        <p className={styles.count}>
          現在の参加人数：
          <strong>{event._count.attendees}</strong> 人
        </p>

        {/* 説明 */}
        {event.description && (
          <p className={styles.description}>{event.description}</p>
        )}

        <form action={joinEvent} className={styles.joinArea}>
          <input type="hidden" name="eventId" value={event.id} />
          <button type="submit" className={styles.joinButton}>
            このイベントに参加する
          </button>
        </form>
      </div>
    </main>
  );
}
