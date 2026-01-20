import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import Image from "next/image";
import crypto from "crypto";
import { getCurrentParticipant } from "@/lib/auth-participant"; // ✅追加

function generateQrToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

async function joinEvent(formData: FormData) {
  "use server";

  const eventId = formData.get("eventId")?.toString();
  if (!eventId) return;

  // ✅ ログイン中ユーザーを使う（統一）
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/user/login");

  const participantId = participant.id;

  const existing = await prisma.eventAttendee.findFirst({
    where: { eventId, participantId },
    select: { id: true },
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
    include: { _count: { select: { attendees: true } } },
  });

  if (!event) {
    return (
      <main className={styles.pageRoot}>
        <div className={styles.pageContainer}>
          <p className={styles.notFound}>イベントが見つかりません</p>
        </div>
      </main>
    );
  }

  const startDate = event.startAt.toLocaleDateString("ja-JP");
  const startTime = event.startAt.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = event.endAt.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        {event.heroImageUrl ? (
          <div className={styles.heroWrap}>
            <Image
              src={event.heroImageUrl}
              alt={`${event.title} の画像`}
              fill
              priority
              className={styles.heroImage}
            />
            <div className={styles.heroShade} />
            <div className={styles.heroBadge}>{startDate}</div>
          </div>
        ) : (
          <div className={styles.heroFallback}>
            <div className={styles.heroFallbackInner}>
              <div className={styles.heroFallbackTitle}>EVENT</div>
              <div className={styles.heroFallbackSub}>{startDate}</div>
            </div>
          </div>
        )}

        <h1 className={styles.title}>{event.title}</h1>

        <div className={styles.metaBlock}>
          <div className={styles.metaRow}>
            <span className={styles.metaIcon}>🗓</span>
            <span className={styles.metaText}>
              {startDate} {startTime} 〜 {endTime}
            </span>
          </div>

          {event.location ? (
            <div className={styles.metaRow}>
              <span className={styles.metaIcon}>📍</span>
              <span className={styles.metaText}>{event.location}</span>
            </div>
          ) : (
            <div className={styles.metaRowMuted}>
              <span className={styles.metaIcon}>📍</span>
              <span className={styles.metaText}>場所情報なし</span>
            </div>
          )}
        </div>

        <section className={styles.infoCard}>
          <div className={styles.countRow}>
            <div className={styles.countLabel}>現在の参加人数</div>
            <div className={styles.countValue}>
              <strong>{event._count.attendees}</strong>
              <span className={styles.countUnit}>人</span>
            </div>
          </div>

          {event.description ? (
            <p className={styles.description}>{event.description}</p>
          ) : (
            <p className={styles.descriptionMuted}>説明はまだありません</p>
          )}
        </section>

        <form action={joinEvent} className={styles.joinArea}>
          <input type="hidden" name="eventId" value={event.id} />
          <button type="submit" className={styles.joinButton}>
            このイベントに参加する
          </button>
          <p className={styles.joinHint}>参加するとQRページに移動します</p>
        </form>
      </div>
    </main>
  );
}
