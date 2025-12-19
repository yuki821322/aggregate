// app/admin/events/EditEventModal.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import modalStyles from "./modal.module.css";
import { updateEvent } from "./actions";

type EditEventModalProps = {
  eventId: string;

  defaultTitle: string;
  defaultLocation?: string | null;
  defaultDescription?: string | null;

  // "YYYY-MM-DD"
  defaultDate: string;

  // "HH:MM"
  defaultStartTime: string;
  defaultEndTime: string;

  defaultLateMinutes?: number | null;
};

export default function EditEventModal({
  eventId,
  defaultTitle,
  defaultLocation,
  defaultDescription,
  defaultDate,
  defaultStartTime,
  defaultEndTime,
  defaultLateMinutes,
}: EditEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const lateDefault = useMemo(() => {
    const v = defaultLateMinutes ?? 15;
    return Number.isFinite(v) ? String(v) : "15";
  }, [defaultLateMinutes]);

  return (
    <>
      <button
        type="button"
        className={modalStyles.editButton}
        onClick={() => setIsOpen(true)}
      >
        編集
      </button>

      {isOpen && (
        <div
          className={modalStyles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="イベント編集モーダル"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={modalStyles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={modalStyles.modalHeader}>
              <h2 className={modalStyles.title}>イベント情報を編集</h2>
              <button
                type="button"
                className={modalStyles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <form
              className={modalStyles.form}
              action={(formData) => {
                startTransition(async () => {
                  await updateEvent(formData);
                  router.refresh();
                  setIsOpen(false);
                });
              }}
            >
              <input type="hidden" name="eventId" value={eventId} />

              {/* ===== 基本情報 ===== */}
              <div className={modalStyles.sectionTitle}>基本情報</div>

              <label className={modalStyles.label}>
                イベント名 <span className={modalStyles.requiredMark}>*</span>
              </label>
              <input
                name="title"
                defaultValue={defaultTitle}
                required
                className={modalStyles.input}
                placeholder="例）2025年度 オリエンテーション"
              />

              <label className={modalStyles.label}>場所（任意）</label>
              <input
                name="location"
                defaultValue={defaultLocation ?? ""}
                className={modalStyles.input}
                placeholder="例）福岡校 3F 301教室 / オンライン（Zoom）"
              />

              <label className={modalStyles.label}>説明（任意）</label>
              <textarea
                name="description"
                defaultValue={defaultDescription ?? ""}
                rows={4}
                className={modalStyles.textarea}
                placeholder="イベントの概要や補足をメモできます。"
              />

              <hr className={modalStyles.divider} />

              {/* ===== 日時 ===== */}
              <div className={modalStyles.sectionTitle}>日時</div>

              <label className={modalStyles.label}>
                日付 <span className={modalStyles.requiredMark}>*</span>
              </label>
              <input
                type="date"
                name="date"
                defaultValue={defaultDate}
                required
                className={modalStyles.input}
              />

              <div className={modalStyles.timeRow}>
                <div className={modalStyles.timeCol}>
                  <label className={modalStyles.label}>
                    開始時刻 <span className={modalStyles.requiredMark}>*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    defaultValue={defaultStartTime}
                    required
                    className={modalStyles.input}
                  />
                </div>

                <div className={modalStyles.timeCol}>
                  <label className={modalStyles.label}>
                    終了時刻 <span className={modalStyles.requiredMark}>*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    defaultValue={defaultEndTime}
                    required
                    className={modalStyles.input}
                  />
                </div>
              </div>

              <label className={modalStyles.label}>遅刻判定（分）</label>
              <input
                type="number"
                name="lateMinutes"
                defaultValue={lateDefault}
                min={0}
                step={1}
                className={modalStyles.input}
                placeholder="例）15"
              />
              <p className={modalStyles.hint}>
                開始時刻から指定分を超えたら「遅刻」扱いにします。
              </p>

              <div className={modalStyles.buttons}>
                <button
                  type="submit"
                  className={modalStyles.saveButton}
                  disabled={isPending}
                >
                  {isPending ? "保存中..." : "保存"}
                </button>

                <button
                  type="button"
                  className={modalStyles.cancelButton}
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
