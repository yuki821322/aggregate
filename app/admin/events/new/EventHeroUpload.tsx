// app/admin/events/new/EventHeroUpload.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./page.module.css";

type Props = { name: string };

export default function EventHeroUpload({ name }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // objectURLの後始末
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ★モーダル中はフォームを完全無効化する（背景の date/time UI が出ないように）
  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;

    if (open) {
      // まずフォーカスを外す（ネイティブUIの発火元を消す）
      (document.activeElement as HTMLElement | null)?.blur();

      // TimeComboSelect を強制クローズ
      window.dispatchEvent(new Event("hero-modal-open"));

      // フォーム側を完全無効化（クリック/フォーカス/ネイティブUI）
      form.setAttribute("inert", "");
      form.setAttribute("aria-hidden", "true");

      // スクロールロック（揺れ防止）
      document.body.style.overflow = "hidden";
    } else {
      form.removeAttribute("inert");
      form.removeAttribute("aria-hidden");
      document.body.style.overflow = "";
    }

    return () => {
      form.removeAttribute("inert");
      form.removeAttribute("aria-hidden");
      document.body.style.overflow = "";
    };
  }, [open]);

  const openModal = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 開く直前にも念押し（Safari系対策）
    (document.activeElement as HTMLElement | null)?.blur();
    window.dispatchEvent(new Event("hero-modal-open"));

    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const openFilePicker = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  // ===== 表示本体（フォーム内に置く部分） =====
  const content = (
    <section className={styles.heroSection}>
      <div className={styles.heroLabelRow}>
        <div className={styles.heroLabel}>トップ画像</div>

        <button type="button" className={styles.heroChangeButton} onClick={openModal}>
          トップ画像を追加
        </button>
      </div>

      {/* hidden input（フォーム送信に必要なのでここに置く） */}
      <input
        ref={inputRef}
        className={styles.heroFileInputHidden}
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={onFileChange}
      />

      <button type="button" className={styles.heroBar} onClick={openModal}>
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className={styles.heroBarImg} />
        ) : (
          <div className={styles.heroBarEmpty}>
            <div className={styles.heroBarEmptyTitle}>画像を追加</div>
            <div className={styles.heroBarEmptyText}>クリックで選択</div>
          </div>
        )}
      </button>

      {/* ===== モーダルは portal（body直下）で出す ===== */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.heroModalOverlay}
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              // 背景クリックで閉じる
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div className={styles.heroModal} onMouseDown={(e) => e.stopPropagation()}>
              <div className={styles.heroModalHead}>
                <div className={styles.heroModalTitle}>トップ画像</div>
                <button
                  type="button"
                  className={styles.heroModalClose}
                  onClick={closeModal}
                  aria-label="閉じる"
                >
                  ×
                </button>
              </div>

              <div className={styles.heroModalBody}>
                <div className={styles.heroModalPreview}>
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="" className={styles.heroModalPreviewImg} />
                  ) : (
                    <div className={styles.heroModalPreviewEmpty}>未選択</div>
                  )}
                </div>

                <div className={styles.heroModalActions}>
                  <button
                    type="button"
                    className={styles.heroMiniButton}
                    onClick={openFilePicker}
                  >
                    画像を選ぶ
                  </button>

                  <button
                    type="button"
                    className={styles.heroMiniButtonGhost}
                    onClick={closeModal}
                  >
                    閉じる
                  </button>
                </div>

                <p className={styles.heroModalHelp}>
                  ※ここでは画像の選択だけが動作します（日時UIは開きません）。
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );

  return content;
}
