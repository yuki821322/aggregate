"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { updateAvatar } from "./actions";

type AvatarWithModalProps = {
  avatarUrl: string | null;
  initial: string;
  displayName: string;
};

export default function AvatarWithModal({
  avatarUrl,
  initial,
  displayName,
}: AvatarWithModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ===== アイコン（タップでモーダル表示） ===== */}
      <button
        type="button"
        className={styles.avatarButton}
        onClick={() => setIsOpen(true)}
        aria-label="プロフィール画像を変更する"
      >
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${displayName}のプロフィール画像`}
                className={styles.avatarImage}
              />
            ) : (
              <span className={styles.avatarInitial}>{initial}</span>
            )}
          </div>

          {/* 右下のカメラバッジ（アイコンの外にはみ出して表示） */}
          <div className={styles.avatarBadge}>
            <img
              src="/profile-icons/camera.svg"
              alt=""
              aria-hidden="true"
              className={styles.avatarBadgeIcon}
            />
          </div>
        </div>
      </button>

      {/* ===== 画像変更モーダル ===== */}
      {isOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>プロフィール画像を変更</h2>
            <p className={styles.modalText}>
              新しい画像を選択してアップロードしてください。
            </p>

            <form action={updateAvatar} className={styles.avatarForm}>
              <label className={styles.fileLabel}>
                <span>画像ファイルを選択</span>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className={styles.fileInput}
                  required
                />
              </label>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setIsOpen(false)}
                >
                  キャンセル
                </button>
                <button type="submit" className={styles.submitButton}>
                  画像を更新する
                </button>
              </div>

              <p className={styles.helpText}>
                1MB 以下の PNG / JPG / GIF 画像をアップロードできます。
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
