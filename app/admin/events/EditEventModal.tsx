// app/admin/events/EditEventModal.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import modalStyles from "./modal.module.css";
import { updateEvent } from "./actions";

type EditEventModalProps = {
  eventId: string;

  defaultTitle: string;
  defaultLocation?: string | null;
  defaultDescription?: string | null;

  defaultDate: string; // YYYY-MM-DD
  defaultStartTime: string; // HH:MM
  defaultEndTime: string; // HH:MM

  defaultHeroImageUrl?: string | null; // ★追加
};

export default function EditEventModal({
  eventId,
  defaultTitle,
  defaultLocation,
  defaultDescription,
  defaultDate,
  defaultStartTime,
  defaultEndTime,
  defaultHeroImageUrl,
}: EditEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // ★ 画像プレビュー（選択中のみ）
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const shownImage = useMemo(() => {
    return previewUrl ?? defaultHeroImageUrl ?? null;
  }, [previewUrl, defaultHeroImageUrl]);

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
          <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
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
                  setPreviewUrl(null);
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
              />

              <label className={modalStyles.label}>場所（任意）</label>
              <input
                name="location"
                defaultValue={defaultLocation ?? ""}
                className={modalStyles.input}
              />

              <label className={modalStyles.label}>説明（任意）</label>
              <textarea
                name="description"
                defaultValue={defaultDescription ?? ""}
                rows={4}
                className={modalStyles.textarea}
              />

              <hr className={modalStyles.divider} />

              {/* ===== 画像 ===== */}
              <div className={modalStyles.sectionTitle}>トップ画像</div>

              <div className={modalStyles.heroRow}>
                <div className={modalStyles.heroPreview}>
                  {shownImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={shownImage}
                      alt="イベントのトップ画像プレビュー"
                      className={modalStyles.heroImg}
                    />
                  ) : (
                    <div className={modalStyles.heroEmpty}>画像なし</div>
                  )}
                </div>

                <div className={modalStyles.heroControls}>
                  <label className={modalStyles.fileLabel}>
                    画像を変更
                    <input
                      type="file"
                      name="heroImageFile"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className={modalStyles.fileInput}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          setPreviewUrl(null);
                          return;
                        }
                        const url = URL.createObjectURL(file);
                        setPreviewUrl((prev) => {
                          if (prev) URL.revokeObjectURL(prev);
                          return url;
                        });
                      }}
                    />
                  </label>

                  {previewUrl && (
                    <button
                      type="button"
                      className={modalStyles.fileReset}
                      onClick={() => setPreviewUrl(null)}
                    >
                      選択をやめる
                    </button>
                  )}

                  <p className={modalStyles.hint}>
                    ※画像を選択したときだけ更新されます（未選択なら現状維持）
                  </p>
                </div>
              </div>

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
