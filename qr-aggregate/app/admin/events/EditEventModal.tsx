// app/admin/events/EditEventModal.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import modalStyles from "./modal.module.css";

// ★ Server Action をインポート
import { updateEvent } from "./actions";

type EditEventModalProps = {
  eventId: string;
  defaultTitle: string;
  defaultDate: string;
  defaultStartTime: string;
};

export default function EditEventModal({
  eventId,
  defaultTitle,
  defaultDate,
  defaultStartTime,
}: EditEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      {/* 編集ボタン */}
      <button
        type="button"
        className={modalStyles.editButton}
        onClick={() => setIsOpen(true)}
      >
        編集
      </button>

      {isOpen && (
        <div className={modalStyles.overlay}>
          <div className={modalStyles.modal}>
            <h2 className={modalStyles.title}>イベント情報を編集</h2>

            <form
              action={(formData) => {
                startTransition(async () => {
                  await updateEvent(formData);
                  router.refresh(); // ← ページをリロードではなく再描画
                  setIsOpen(false); // ← モーダルを閉じる
                });
              }}
            >
              <input type="hidden" name="eventId" value={eventId} />

              <label className={modalStyles.label}>イベント名</label>
              <input
                name="title"
                defaultValue={defaultTitle}
                required
                className={modalStyles.input}
              />

              <label className={modalStyles.label}>日付</label>
              <input
                type="date"
                name="date"
                defaultValue={defaultDate}
                required
                className={modalStyles.input}
              />

              <label className={modalStyles.label}>開始時刻</label>
              <input
                type="time"
                name="startAt"
                defaultValue={defaultStartTime}
                required
                className={modalStyles.input}
              />

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
