"use client";

import { useState } from "react";
import styles from "./modal.module.css";

type EditModalProps = {
  participant: {
    id: string;
    name: string;
    email: string | null;
    code: string | null;
    remarks: string | null;
  };
  eventId: string;
  onSubmit: (formData: FormData) => void;
};

export default function EditModal({
  participant,
  eventId,
  onSubmit,
}: EditModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 編集ボタン */}
      <button
        type="button"
        className={styles.editButton}
        onClick={() => setIsOpen(true)}
      >
        編集
      </button>

      {/* モーダル本体 */}
      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.title}>参加者情報を編集</h2>

            <form
              action={(formData) => {
                onSubmit(formData);
                setIsOpen(false);
              }}
            >
              <input type="hidden" name="participantId" value={participant.id} />
              <input type="hidden" name="eventId" value={eventId} />

              <label className={styles.label}>氏名</label>
              <input
                name="name"
                defaultValue={participant.name}
                required
                className={styles.input}
              />

              <label className={styles.label}>メール</label>
              <input
                name="email"
                defaultValue={participant.email ?? ""}
                className={styles.input}
              />

              <label className={styles.label}>コード</label>
              <input
                name="code"
                defaultValue={participant.code ?? ""}
                className={styles.input}
              />

              <label className={styles.label}>備考</label>
              <textarea
                name="remarks"
                defaultValue={participant.remarks ?? ""}
                className={styles.textarea}
              />

              <div className={styles.buttons}>
                <button type="submit" className={styles.saveButton}>
                  保存
                </button>

                <button
                  type="button"
                  className={styles.cancelButton}
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
