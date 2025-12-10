// app/admin/events/new/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import DateWheelPicker from "./DateWheelPicker";
import TimeComboSelect from "./TimeComboSelect";

// ==============================
//   サーバーアクション
// ==============================
async function createEvent(formData: FormData) {
  "use server";

  // 1. フォーム値を取り出す
  const title = (formData.get("title") ?? "").toString().trim();
  const description = (formData.get("description") ?? "").toString().trim();

  // 年・月・日（ホイールコンポーネントから取得）
  const yearStr = (formData.get("dateYear") ?? "").toString();
  const monthStr = (formData.get("dateMonth") ?? "").toString();
  const dayStr = (formData.get("dateDay") ?? "").toString();

  const startTimeStr = (formData.get("startTime") ?? "").toString();
  const endTimeStr = (formData.get("endTime") ?? "").toString();
  const lateMinutesStr = (formData.get("lateMinutes") ?? "15").toString();

  // 2. 必須チェック
  if (
    !title ||
    !yearStr ||
    !monthStr ||
    !dayStr ||
    !startTimeStr ||
    !endTimeStr
  ) {
    return;
  }

  // 3. YYYY-MM-DD 文字列を組み立て
  const dateStr = `${yearStr}-${monthStr.padStart(2, "0")}-${dayStr.padStart(
    2,
    "0"
  )}`;

  // JS の Date に変換
  const startAt = new Date(`${dateStr}T${startTimeStr}:00`);
  const endAt = new Date(`${dateStr}T${endTimeStr}:00`);
  const date = new Date(`${dateStr}T00:00:00`);

  const lateThresholdMinutes = Number.isNaN(Number(lateMinutesStr))
    ? 15
    : Number(lateMinutesStr);

  // 4. DB に保存
  await prisma.event.create({
    data: {
      title,
      description: description || null,
      date,
      startAt,
      endAt,
      lateThresholdMinutes,
      ownerId: "2bf0ef3f-97c2-4d6b-84d2-221eab82fd29", // 対応する AccountUser を作っておいてね
    },
  });

  // 5. 登録後に一覧へ
  redirect("/admin/events");
}

// ==============================
//   ページ本体
// ==============================
export default function NewEventPage() {
  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>新規イベント作成</h1>

        <form action={createEvent} className={styles.form}>
          {/* イベント名 */}
          <div className={styles.field}>
            <label className={styles.label}>
              イベント名 <span className={styles.requiredMark}>*</span>
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

          {/* 日付（ホイールコンポーネント） */}
          <div className={styles.field}>
            <label className={styles.label}>
              日付 <span className={styles.requiredMark}>*</span>
            </label>
            <DateWheelPicker />
          </div>

          {/* 開始時刻 */}
          <div className={styles.field}>
            <label className={styles.label}>
              開始時刻 <span className={styles.requiredMark}>*</span>
            </label>
            <TimeComboSelect name="startTime"/>
          </div>

          {/* 終了時刻 */}
          <div className={styles.field}>
            <label className={styles.label}>
              終了時刻 <span className={styles.requiredMark}>*</span>
            </label>
            <TimeComboSelect name="endTime" />
          </div>

          {/* 遅刻判定 */}
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
