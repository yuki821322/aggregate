// app/admin/events/EditEventModal.tsx
"use client";

import { useState } from "react";
import modalStyles from "./modal.module.css";

type EditEventModalProps = {
  eventId: string;
  defaultTitle: string;
  defaultDate: string;      // "YYYY-MM-DD"
  defaultStartTime: string; // "HH:MM"
};

export default function EditEventModal({
  eventId,
  defaultTitle,
  defaultDate,
  defaultStartTime,
}: EditEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 一覧の「編集」ボタン */}
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
              method="POST"
              action="/admin/events/update"
              // onSubmit では何も特別なことをしない
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
                <button type="submit" className={modalStyles.saveButton}>
                  保存
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
