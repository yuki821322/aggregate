// app/admin/events/[eventId]/dashboard/EditCard.tsx
"use client";

import { useState } from "react";
import styles from "./page.module.css";
import EditEventModal from "@/app/admin/events/EditEventModal";

type Props = {
  eventId: string;

  defaultTitle: string;
  defaultLocation?: string | null;
  defaultDescription?: string | null;

  defaultDate: string;
  defaultStartTime: string;
  defaultEndTime: string;

  defaultHeroImageUrl?: string | null;
};

export default function EditCard(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ✅ カード全体がクリック対象 */}
      <button
        type="button"
        className={styles.actionCardButton}
        onClick={() => setOpen(true)}
      >
        <div className={styles.actionCardTitle}>イベント編集</div>
        <div className={styles.actionCardHint}>
          タイトル / 日付 / 時刻 / 画像
        </div>
      </button>

      <EditEventModal
        {...props}
        open={open}
        onOpenChange={setOpen}
        hideTrigger
      />
    </>
  );
}
