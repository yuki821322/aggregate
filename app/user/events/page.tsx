// app/user/events/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

// ==============================
// 仮：ログイン実装までの暫定
// ==============================
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

// ==============================
// QRトークン生成（※このページでは使ってないなら消してOK）
// ==============================
function generateQrToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

// ==============================
// 参加（server action）（※このページでボタン出さないなら消してOK）
// ==============================
async function joinEvent(formData: FormData) {
  "use server";

  const eventId = formData.get("eventId")?.toString();
  if (!eventId) return;

  const participantId = await getCurrentParticipantId();

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

export default async function UserEventsPage() {
  const participantId = await getCurrentParticipantId();

  // ✅ 作成者（owner）も一緒に取得
  const events = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

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
              {events.map((event) => {
                const owner = event.owner;

                return (
                  <li key={event.id} className={styles.eventLi}>
                    <Link
                      href={`/user/events/${event.id}`}
                      className={styles.eventItemLink}
                    >
                      <article className={styles.eventItem}>
                        {/* ✅ 左：本文 */}
                        <div className={styles.eventInfo}>
                          <h2 className={styles.eventTitle}>{event.title}</h2>

                          <p className={styles.eventMeta}>
                            {event.startAt.toLocaleDateString("ja-JP")}{" "}
                            {event.startAt.toLocaleTimeString("ja-JP", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                          {/* ✅ 作成者（アイコン＋名前） */}
                          <div className={styles.ownerRow}>
                            <div className={styles.ownerAvatar}>
                              {owner.avatarUrl ? (
                                <Image
                                  src={owner.avatarUrl}
                                  alt="作成者アイコン"
                                  fill
                                  className={styles.ownerAvatarImg}
                                />
                              ) : (
                                <span className={styles.ownerAvatarFallback}>
                                  {(owner.name?.trim()?.[0] ?? "A").toUpperCase()}
                                </span>
                              )}
                            </div>

                            <p className={styles.ownerName}>
                              作成：{owner.name ?? "管理者"}
                            </p>

                            {joinedSet.has(event.id) && (
                              <span className={styles.joinedBadge}>参加済み</span>
                            )}
                          </div>

                          {event.location && (
                            <p className={styles.locationLine}>
                              📍 {event.location}
                            </p>
                          )}

                          {event.description && (
                            <p className={styles.eventDesc}>{event.description}</p>
                          )}
                        </div>
                      </article>
                    </Link>

                    {/* ✅ もし一覧から参加させたいなら（任意）
                        詳細ページで参加させるならこのブロックは削除でOK */}
                    {/*
                    <form action={joinEvent} className={styles.joinInline}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <button className={styles.joinButton} type="submit">
                        参加する
                      </button>
                    </form>
                    */}
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
