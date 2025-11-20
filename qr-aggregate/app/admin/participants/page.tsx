// app/admin/participants/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { randomUUID } from "crypto";
import EditModal from "./EditModal";


// =======================================
// Prisma v6：include を含む型の安全な定義
// =======================================
type EventWithAttendees = NonNullable<
  Awaited<ReturnType<typeof prisma.event.findUnique>>
>;

type EventAttendeeItem = EventWithAttendees["attendees"][number];
// =======================================

type ParticipantsPageProps = {
  searchParams: Promise<{
    eventId?: string;
  }>;
};
// ★ Server Action: 参加者を更新
async function updateParticipant(formData: FormData) {
  "use server";

  const participantId = formData.get("participantId")?.toString() ?? "";
  const eventId = formData.get("eventId")?.toString() ?? "";

  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() || null;
  const code = formData.get("code")?.toString().trim() || null;
  const remarks = formData.get("remarks")?.toString().trim() || null;

  if (!participantId || !name) return;

  await prisma.participant.update({
    where: { id: participantId },
    data: { name, email, code, remarks },
  });

  redirect(`/admin/participants?eventId=${eventId}`);
}


// ★ Server Action: 参加者を追加する処理
async function addParticipant(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() || null;
  const code = formData.get("code")?.toString().trim() || null;
  const remarks = formData.get("remarks")?.toString().trim() || null;
  const eventId = formData.get("eventId")?.toString() ?? "";

  if (!name || !eventId) return;

  // ① Participant を作成
  const participant = await prisma.participant.create({
    data: { name, email, code, remarks },
  });

  // ★ ここで QR 用のトークンを発行
  const qrToken = randomUUID(); // 一意なID（例: "0fbd2c1c-..."）

  // ② EventAttendee と紐付け（＋ qrToken を保存）
  await prisma.eventAttendee.create({
    data: {
      eventId,
      participantId: participant.id,
      qrToken, // ← これを追加！
    },
  });

  // ③ リダイレクト
  redirect(`/admin/participants?eventId=${eventId}`);
}


// ★ Server Action: 参加者を削除する処理（EventAttendee + Participant 両方削除）
async function deleteParticipant(formData: FormData) {
  "use server";

  const attendeeId = formData.get("attendeeId")?.toString() ?? "";
  const participantId = formData.get("participantId")?.toString() ?? "";
  const eventId = formData.get("eventId")?.toString() ?? "";

  if (!attendeeId || !participantId || !eventId) return;

  // EventAttendee → Participant の順に削除
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
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      attendees: {
        include: { participant: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

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

        {/* 参加者追加フォーム */}
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>参加者を追加</h2>

          <form action={addParticipant} className={styles.form}>
            <input type="hidden" name="eventId" value={event.id} />

            <div className={styles.field}>
              <label className={styles.label}>
                氏名<span className={styles.required}>*</span>
              </label>
              <input name="name" required className={styles.input} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>メール（任意）</label>
              <input name="email" type="email" className={styles.input} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>コード（任意）</label>
              <input name="code" className={styles.input} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>備考（任意）</label>
              <textarea name="remarks" className={styles.textarea} />
            </div>

            <button type="submit" className={styles.submitButton}>
              追加する
            </button>
          </form>
        </div>

        {/* 参加者一覧 */}
        {attendees.length === 0 ? (
          <div className={styles.emptyBox}>
            このイベントにはまだ参加者が登録されていません。
            <div className={styles.emptyHint}>
              上のフォームから参加者を登録できます。
            </div>
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
                      <form action={deleteParticipant}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <input type="hidden" name="attendeeId" value={a.id} />
                        <input
                          type="hidden"
                          name="participantId"
                          value={a.participantId}
                        />
                        <EditModal
                            participant={a.participant}
                            eventId={event.id}
                            onSubmit={updateParticipant}
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
