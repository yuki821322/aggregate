// app/admin/events/new/EventHeroUpload.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Props = {
  name: string; // heroImageFile
};

export default function EventHeroUpload({ name }: Props) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("選択されていません");
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
    setFileName("選択されていません");
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  };

  const onFileChange = (file?: File) => {
    if (!file) return;

    setFileName(file.name);

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  // 破棄時URL解放
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className={styles.heroSection}>
      {/* ===== ファイル選択 行（画像のUIの部分） ===== */}
      <div className={styles.fileRow}>
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept="image/*"
          className={styles.heroFileInputHidden}
          onChange={(e) => onFileChange(e.currentTarget.files?.[0])}
        />

        <button type="button" className={styles.filePickBtn} onClick={pickFile}>
          ファイルを選択
        </button>

        <div className={styles.fileNameBox} title={fileName}>
          {fileName}
        </div>
      </div>

      {/* ===== 正方形プレビュー（クリックでモーダル） ===== */}
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
              上のボタンから画像を選択できます
            </div>
          </div>
        )}
      </button>

      {/* ===== モーダル ===== */}
      {open && (
        <div
          className={styles.heroModalOverlay}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
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
                <button type="button" className={styles.heroMiniButton} onClick={pickFile}>
                  PCから画像を選ぶ
                </button>

                <button type="button" className={styles.heroMiniButtonGhost} onClick={clearFile}>
                  クリア
                </button>

                <button
                  type="button"
                  className={styles.heroMiniButtonGhost}
                  onClick={() => setOpen(false)}
                >
                  この画像でOK
                </button>
              </div>

              <p className={styles.heroModalHelp}>PNG / JPG / WEBP / GIF（推奨3MB以下）</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
