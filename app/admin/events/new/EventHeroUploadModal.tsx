"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Props = {
  name: string; // "heroImageFile"
};

export default function EventHeroUploadModal({ name }: Props) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ESCで閉じる
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const pickFile = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewUrl("");
  };

  const onFileChange = (file: File | undefined) => {
    if (!file) return;

    // 既存URLがあれば破棄
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  // コンポーネント破棄時にURL解放
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroLabelRow}>
        <div className={styles.heroLabel}>トップ画像（任意）</div>

        <button
          type="button"
          className={styles.heroChangeButton}
          onClick={() => setOpen(true)}
        >
          画像を選ぶ
        </button>
      </div>

      {/* ===== 送信用 input（隠す） ===== */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        className={styles.heroFileInputHidden}
        onChange={(e) => onFileChange(e.currentTarget.files?.[0])}
      />

      {/* ===== 横長バー（クリックでモーダル） ===== */}
      <button
        type="button"
        className={styles.heroBar}
        onClick={() => setOpen(true)}
        aria-label="トップ画像を選択"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className={styles.heroBarImg} />
        ) : (
          <div className={styles.heroBarEmpty}>
            <div className={styles.heroBarEmptyTitle}>トップ画像を追加</div>
            <div className={styles.heroBarEmptyText}>
              クリックしてモーダルを開き、PCから画像を選択
            </div>
          </div>
        )}
      </button>

      <p className={styles.hint}>
        推奨：横長（16:9）。ローカルでは保存されます（本番は後でStorage推奨）。
      </p>

      {/* ===== モーダル ===== */}
      {open && (
        <div
          className={styles.heroModalOverlay}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // 背景クリックで閉じる
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className={styles.heroModal}>
            <div className={styles.heroModalHead}>
              <div className={styles.heroModalTitle}>トップ画像を選択</div>
              <button
                type="button"
                className={styles.heroModalClose}
                onClick={() => setOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            {/* モーダル内プレビュー */}
            <div className={styles.heroModalBody}>
              <div className={styles.heroModalPreview}>
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="" className={styles.heroModalPreviewImg} />
                ) : (
                  <div className={styles.heroModalPreviewEmpty}>
                    まだ画像が選択されていません
                  </div>
                )}
              </div>

              <div className={styles.heroModalActions}>
                <button type="button" className={styles.heroPrimaryBtn} onClick={pickFile}>
                  PCから画像を選ぶ
                </button>

                <button type="button" className={styles.heroGhostBtn} onClick={clearFile}>
                  クリア
                </button>

                <button
                  type="button"
                  className={styles.heroDoneBtn}
                  onClick={() => setOpen(false)}
                >
                  この画像でOK
                </button>
              </div>

              <p className={styles.heroModalHelp}>
                PNG / JPG / WEBP / GIF（推奨3MB以下）
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
