// app/admin/participants/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import EditModal from "./EditModal";

// =======================================
// 型定義（使っている項目だけを素直に書く）
// =======================================

type EventAttendeeItem = {
    id: string;
    participantId: string;
    participant: {
    id: string;
    name: string;
    email: string | null;
    code: string | null;
    
    remarks: string | null;
  };
};

type EventWithAttendees = {
  id: string;
  title: string;
  date: Date;
  startAt: Date;
  attendees: EventAttendeeItem[];
};

// =======================================

type ParticipantsPageProps = {
  searchParams: Promise<{
    eventId?: string;
  }>;
};

// ★ Server Action: 参加者を削除する処理（EventAttendee + Participant 両方削除）
async function deleteParticipant(formData: FormData) {
  "use server";

  const attendeeId = formData.get("attendeeId")?.toString() ?? "";
  const participantId = formData.get("participantId")?.toString() ?? "";
  const eventId = formData.get("eventId")?.toString() ?? "";

  if (!attendeeId || !participantId || !eventId) return;

  await prisma.$transaction([
    prisma.eventAttendee.delete({ where: { id: attendeeId } }),
    prisma.participant.delete({ where: { id: participantId } }),
  ]);

  redirect(`/admin/participants?eventId=${eventId}`);
}

// ==================================================
// ページ本体
// ==================================================
export default async function ParticipantsPage({
  searchParams,
}: ParticipantsPageProps) {
  const { eventId } = await searchParams;

  // eventId がない場合
  if (!eventId) {
    return (
      <main className={styles.pageRoot}>
        <div className={styles.pageContainer}>
          <header className={styles.pageHeader}>
            <div className={styles.pageTitleRow}>
              <h1 className={styles.pageTitle}>参加者管理</h1>
              <Link href="/admin/events" className={styles.backLink}>
                ← イベント一覧へ戻る
              </Link>
            </div>
          </header>

          <div className={styles.notice}>
            <div className={styles.noticeTitle}>イベントが選択されていません。</div>
            <p className={styles.noticeText}>
              URL に <code>?eventId=...</code> を付けてアクセスしてください。
            </p>
          </div>
        </div>
      </main>
    );
  }

  // イベントと参加者を取得
  const event = (await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      attendees: {
        include: { participant: true },
        orderBy: { createdAt: "asc" },
      },
    },
  })) as EventWithAttendees | null;

  // eventId が不正な場合
  if (!event) {
    return (
      <main className={styles.pageRoot}>
        <div className={styles.pageContainer}>
          <header className={styles.pageHeader}>
            <div className={styles.pageTitleRow}>
              <h1 className={styles.pageTitle}>参加者管理</h1>
              <Link href="/admin/events" className={styles.backLink}>
                ← イベント一覧へ戻る
              </Link>
            </div>
          </header>

          <div className={styles.notice}>
            <div className={styles.noticeTitle}>指定されたイベントが見つかりません。</div>
            <p className={styles.noticeText}>
              URL の <code>eventId</code> を確認してください。
            </p>
          </div>
        </div>
      </main>
    );
  }

  const attendees = event.attendees;

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        {/* ヘッダー */}
        <header className={styles.pageHeader}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>参加者管理</h1>
            <Link href="/admin/events" className={styles.backLink}>
              ← イベント一覧へ戻る
            </Link>
          </div>
          <div className={styles.eventMeta}>
            イベント：{event.title}（{event.date.toLocaleDateString("ja-JP")}）
          </div>
        </header>

        {/* 参加者一覧 */}
        {attendees.length === 0 ? (
          <div className={styles.emptyBox}>
            このイベントにはまだ参加者が登録されていません。
          </div>
        ) : (
          <section className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.th}>氏名</th>
                  <th className={styles.th}>コード</th>
                  <th className={styles.th}>メール</th>
                  <th className={styles.th}>メモ</th>
                  <th className={styles.th}>操作</th>
                </tr>
              </thead>

              <tbody>
                {attendees.map((a: EventAttendeeItem) => (
                  <tr key={a.id} className={styles.tr}>
                    <td className={styles.td}>
                      {a.participant.name}
                      {a.participant.email && (
                        <div className={styles.tdSub}>{a.participant.email}</div>
                      )}
                    </td>
                    <td className={styles.td}>{a.participant.code ?? "—"}</td>
                    <td className={styles.td}>{a.participant.email ?? "—"}</td>
                    <td className={styles.td}>{a.participant.remarks ?? "—"}</td>
                    <td className={styles.tdActions}>
                      <EditModal
                        participant={a.participant}
                        eventId={event.id}
                      />

                      <form action={deleteParticipant} style={{ display: "inline" }}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <input type="hidden" name="attendeeId" value={a.id} />
                        <input
                          type="hidden"
                          name="participantId"
                          value={a.participantId}
                        />
                        <button
                          type="submit"
                          className={styles.deleteButton}
                        >
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
