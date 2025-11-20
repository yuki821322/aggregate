// app/admin/events/new/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

// サーバーアクション：フォーム送信時に呼ばれる関数
async function createEvent(formData: FormData) {
  "use server";

  // 1. フォーム値を取り出す
  const title = (formData.get("title") ?? "").toString().trim();
  const description = (formData.get("description") ?? "").toString().trim();
  const dateStr = (formData.get("date") ?? "").toString();
  const startTimeStr = (formData.get("startTime") ?? "").toString();
  const endTimeStr = (formData.get("endTime") ?? "").toString();
  const lateMinutesStr = (formData.get("lateMinutes") ?? "15").toString();

  // 2. 必須チェック（最低限）
  if (!title || !dateStr || !startTimeStr || !endTimeStr) {
    // TODO: 本当はエラーメッセージを返して画面に出したい
    return;
  }

  // 3. 日付と時刻を JS の Date に変換
  const startAt = new Date(`${dateStr}T${startTimeStr}:00`);
  const endAt = new Date(`${dateStr}T${endTimeStr}:00`);
  const date = new Date(`${dateStr}T00:00:00`);

  const lateThresholdMinutes = Number.isNaN(Number(lateMinutesStr))
    ? 15
    : Number(lateMinutesStr);

  // 4. DB に保存（ownerId は今は固定 "admin-1"）
  await prisma.event.create({
    data: {
      title,
      description: description || null,
      date,
      startAt,
      endAt,
      lateThresholdMinutes,
      ownerId: "admin-1",
    },
  });

  // 5. 登録後に一覧へ
  redirect("/admin/events");
}

// ページ本体
export default function NewEventPage() {
  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>新規イベント作成</h1>

        <form action={createEvent} className={styles.form}>
          {/* イベント名 */}
          <div className={styles.field}>
            <label className={styles.label}>
              イベント名
              <span className={styles.requiredMark}>*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              className={styles.input}
              placeholder="例）2025年度 オリエンテーション"
            />
          </div>

          {/* 説明 */}
          <div className={styles.field}>
            <label className={styles.label}>説明（任意）</label>
            <textarea
              name="description"
              rows={3}
              className={styles.textarea}
              placeholder="イベントの概要や場所などをメモしておけます。"
            />
          </div>

          {/* 日付・時間 */}
          <div className={styles.rowGroup}>
            <div className={styles.field}>
              <label className={styles.label}>
                日付
                <span className={styles.requiredMark}>*</span>
              </label>
              <input
                name="date"
                type="date"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                開始時刻
                <span className={styles.requiredMark}>*</span>
              </label>
              <input
                name="startTime"
                type="time"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                終了時刻
                <span className={styles.requiredMark}>*</span>
              </label>
              <input
                name="endTime"
                type="time"
                required
                className={styles.input}
              />
            </div>
          </div>

          {/* 遅刻判定分数 */}
          <div className={styles.field}>
            <label className={styles.label}>遅刻判定（分）</label>
            <input
              name="lateMinutes"
              type="number"
              min={0}
              defaultValue={15}
              className={styles.input}
            />
            <p className={styles.lateHint}>
              開始時刻から何分以降を「遅刻」とみなすかを指定します。
            </p>
          </div>

          {/* ボタン */}
          <div className={styles.actions}>
            <a href="/admin/events" className={styles.cancelLink}>
              キャンセル
            </a>
            <button type="submit" className={styles.submitButton}>
              保存する
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
