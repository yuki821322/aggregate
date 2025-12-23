// app/user/events/management/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { getCurrentParticipant } from "@/lib/auth-participant";

function fmtDate(d: Date) {
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
function fmtTime(d: Date) {
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

export default async function UserEventManagementPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/user/login");

  const participantId = participant.id;

  // ✅ 参加登録済みイベントを全部取得（区分しない）
  const joined = await prisma.eventAttendee.findMany({
    where: { participantId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          startAt: true,
          endAt: true,
          location: true,
          heroImageUrl: true,
          owner: { select: { name: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>イベント管理</h1>
          <p className={styles.pageSub}>
            参加登録したイベントと、発行済みQRの表示ができます。
          </p>
        </header>

        {/* 参加済みが0件 */}
        {joined.length === 0 && (
          <div className={styles.emptyCard}>
            <p className={styles.emptyTitle}>参加済みイベントがありません</p>
            <p className={styles.emptyText}>
              「イベント一覧」からイベント詳細を開いて「参加する」を押すと、ここに表示されます。
            </p>
            <Link href="/user/events" className={styles.primaryLink}>
              イベント一覧へ
            </Link>
          </div>
        )}

        {/* ✅ 参加しているイベント一覧だけ */}
        {joined.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>参加しているイベント</h2>
              <span className={styles.sectionCount}>{joined.length}</span>
            </div>

            <ul className={styles.cardList}>
              {joined.map((a) => {
                const e = a.event;

                return (
                  <li key={a.id} className={styles.card}>
                    <div className={styles.cardTop}>
                      <div className={styles.heroWrap}>
                        {e.heroImageUrl ? (
                          <Image
                            src={e.heroImageUrl}
                            alt=""
                            fill
                            className={styles.heroImage}
                            sizes="(max-width: 900px) 100vw, 420px"
                          />
                        ) : (
                          <div className={styles.heroFallback}>EVENT</div>
                        )}
                      </div>

                      <div className={styles.cardMain}>
                        <div className={styles.titleRow}>
                          <h3 className={styles.eventTitle}>{e.title}</h3>
                          <span className={styles.badgeUpcoming}>参加済み</span>
                        </div>

                        <p className={styles.meta}>
                          {fmtDate(e.startAt)} {fmtTime(e.startAt)}〜{fmtTime(e.endAt)}
                        </p>

                        {e.location && <p className={styles.location}>📍 {e.location}</p>}

                        <div className={styles.ownerRow}>
                          <div className={styles.ownerAvatar}>
                            {e.owner.avatarUrl ? (
                              <Image
                                src={e.owner.avatarUrl}
                                alt=""
                                fill
                                className={styles.ownerAvatarImg}
                              />
                            ) : (
                              <span className={styles.ownerAvatarFallback}>
                                {(e.owner.name?.trim()?.[0] ?? "A").toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className={styles.ownerName}>作成：{e.owner.name ?? "管理者"}</p>
                        </div>

                        {e.description && <p className={styles.desc}>{e.description}</p>}

                        <div className={styles.actions}>
                          <Link href={`/user/events/${e.id}`} className={styles.secondaryBtn}>
                            詳細を見る
                          </Link>
                          <Link href={`/user/events/${e.id}/qr`} className={styles.primaryBtn}>
                            QRを表示
                          </Link>
                        </div>

                        <p className={styles.note}>
                          ステータス：{a.status}
                          {a.firstCheckedInAt
                            ? ` / 出席: ${fmtDate(a.firstCheckedInAt)} ${fmtTime(a.firstCheckedInAt)}`
                            : ""}
                        </p>
                      </div>
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
