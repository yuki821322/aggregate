"use client";

import { useRef, useState, useTransition } from "react";
import styles from "./page.module.css";

type Props = {
  eventId: string;
  eventTitle: string;
  action: (formData: FormData) => void; // Server Action
};

export default function DeleteConfirmCard({ eventId, eventTitle, action }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const close = () => {
    if (isPending) return;
    setOpen(false);
  };

  return (
    <>
      {/* ✅ カード全体クリック -> 確認モーダル */}
      <button
        type="button"
        className={styles.actionCardDangerButton}
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        <div className={styles.actionCardTitle}>イベント削除</div>
        <div className={styles.actionCardHint}>削除は取り消せません</div>
      </button>

      {/* ✅ Server Action 用フォーム（隠し） */}
      <form ref={formRef} action={action} className={styles.hiddenForm}>
        <input type="hidden" name="eventId" value={eventId} />
      </form>

      {open && (
        <div
          className={styles.confirmOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="削除確認"
          onClick={close}
        >
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmTitle}>本当に削除してもいいですか？</div>

            <p className={styles.confirmText}>
              「<span className={styles.confirmEventName}>{eventTitle}</span>」を削除します。
              <br />
              関連データも削除され、この操作は取り消せません。
            </p>

            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmCancel}
                onClick={close}
                disabled={isPending}
              >
                キャンセル
              </button>

              <button
                type="button"
                className={styles.confirmDelete}
                disabled={isPending}
                onClick={() => {
                  startTransition(() => {
                    formRef.current?.requestSubmit();
                  });
                }}
              >
                {isPending ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
