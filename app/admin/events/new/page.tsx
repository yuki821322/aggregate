// app/admin/events/new/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import DateWheelPicker from "./DateWheelPicker";
import TimeComboSelect from "./TimeComboSelect";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import EventHeroUpload from "./EventHeroUpload";

async function saveHeroToPublic(file: File): Promise<string> {
  // 1) バリデーション（必要なら調整）
  if (!file || file.size === 0) throw new Error("ファイルが空です");
  if (file.size > 3 * 1024 * 1024) throw new Error("画像は3MB以下にしてください");

  const ok = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!ok.includes(file.type)) throw new Error("対応していない画像形式です");

  // 2) 保存先（public/event-hero）
  const dir = path.join(process.cwd(), "public", "event-hero");
  await fs.mkdir(dir, { recursive: true });

  // 3) 拡張子
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/webp"
      ? "webp"
      : "gif";

  // 4) ファイル名（衝突回避）
  const filename = `hero_${Date.now()}_${crypto.randomUUID()}.${ext}`;
  const filepath = path.join(dir, filename);

  // 5) 書き込み
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, bytes);

  // 6) ブラウザから参照するパス
  return `/event-hero/${filename}`;
}

// ==============================
//   サーバーアクション
// ==============================
async function createEvent(formData: FormData) {
  "use server";

  const title = (formData.get("title") ?? "").toString().trim();
  const location = (formData.get("location") ?? "").toString().trim();
  const description = (formData.get("description") ?? "").toString().trim();

  // ★トップ画像（PCから選択したファイル）
  const heroFile = formData.get("heroImageFile");
  let heroImageUrl: string | null = null;

  if (heroFile instanceof File && heroFile.size > 0) {
    heroImageUrl = await saveHeroToPublic(heroFile);
  }

  const yearStr = (formData.get("dateYear") ?? "").toString();
  const monthStr = (formData.get("dateMonth") ?? "").toString();
  const dayStr = (formData.get("dateDay") ?? "").toString();
  const startTimeStr = (formData.get("startTime") ?? "").toString();
  const endTimeStr = (formData.get("endTime") ?? "").toString();
  const lateMinutesStr = (formData.get("lateMinutes") ?? "15").toString();

  if (!title || !yearStr || !monthStr || !dayStr || !startTimeStr || !endTimeStr) return;

  const dateStr = `${yearStr}-${monthStr.padStart(2, "0")}-${dayStr.padStart(2, "0")}`;
  const startAt = new Date(`${dateStr}T${startTimeStr}:00`);
  const endAt = new Date(`${dateStr}T${endTimeStr}:00`);
  const date = new Date(`${dateStr}T00:00:00`);

  const lateThresholdMinutes = Number.isNaN(Number(lateMinutesStr))
    ? 15
    : Number(lateMinutesStr);

  await prisma.event.create({
    data: {
      title,
      location: location || null,
      description: description || null,
      heroImageUrl, // ★DBには /event-hero/xxx.jpg を保存
      date,
      startAt,
      endAt,
      lateThresholdMinutes,
      ownerId: "2bf0ef3f-97c2-4d6b-84d2-221eab82fd29",
    },
  });

  redirect("/admin/events");
}

// ==============================
//   ページ本体
// ==============================
export default function NewEventPage() {
  return (
    <main className={styles.pageRoot}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <h1 className={styles.pageTitle}>新規イベント作成</h1>
          <p className={styles.pageSubtitle}>
            イベントの基本情報・日時・遅刻判定などを登録します。トップ画像はPCから選べます（ローカル保存）。
          </p>
          <div className={styles.backLinkRow}>
            <a href="/admin/events" className={styles.backLink}>
              ← イベント一覧へ戻る
            </a>
          </div>
        </div>
      </header>

      <div className={styles.pageContainer}>
        {/* ★ファイル送信が必要なので form はそのままでOK（Server Actionが受ける） */}
        <form action={createEvent} className={styles.form}>
          <section className={styles.section}>
            {/* ===== 基本情報 ===== */}
            <h2 className={styles.sectionTitle}>基本情報</h2>

            <div className={styles.basicInfoGrid}>
              <div className={styles.basicInfoLeft}>
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

                <div className={styles.field}>
                  <label className={styles.label}>場所（任意）</label>
                  <input
                    name="location"
                    type="text"
                    className={styles.input}
                    placeholder="例）福岡校 3F 301教室 / オンライン（Zoom）"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>説明（任意）</label>
                  <textarea
                    name="description"
                    rows={4}
                    className={styles.textarea}
                    placeholder="イベントの概要や補足をメモしておけます。"
                  />
                </div>
              </div>

              <aside className={styles.basicInfoRight}>
                <EventHeroUpload name="heroImageFile" />

                <p className={styles.hint} style={{ marginTop: 10 }}>
                  ※ローカル開発では <code className={styles.code}>public/event-hero/</code> に保存されます。
                  Vercel本番では永続化されないので、後でSupabase Storageに移行する想定が安全です。
                </p>
              </aside>
            </div>

            {/* ===== 区切り線（カード内でセクション分け） ===== */}
            <hr className={styles.sectionDivider} />

            {/* ===== 日時 ===== */}
            <h2 className={styles.sectionTitle}>日時</h2>

            <div className={styles.field}>
              <label className={styles.label}>
                日付 <span className={styles.requiredMark}>*</span>
              </label>
              <DateWheelPicker />
            </div>

            <div className={styles.timeRow}>
              <div className={styles.field}>
                <label className={styles.label}>
                  開始時刻 <span className={styles.requiredMark}>*</span>
                </label>
                <TimeComboSelect name="startTime" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  終了時刻 <span className={styles.requiredMark}>*</span>
                </label>
                <TimeComboSelect name="endTime" />
              </div>
            </div>

            {/* ===== 区切り線（アクション手前） ===== */}
            <div className={styles.actions}>
              <a href="/admin/events" className={styles.cancelLink}>
                キャンセル
              </a>
              <button type="submit" className={styles.submitButton}>
                保存する
              </button>
            </div>
          </section>
        </form>

      </div>
    </main>
  );
}
