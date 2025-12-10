// app/user/mypage/RadialMenu.tsx
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./page.module.css";

type RadialItem = {
  label: string;
  icon: string;
  href: string;
};

const ITEMS: RadialItem[] = [
  { label: "ホーム", icon: "🏠", href: "/user/mypage" },
  { label: "出席履歴", icon: "📊", href: "/user/history" },
  { label: "今日のイベント", icon: "📅", href: "/user/events/today" },
  { label: "プロフィール", icon: "👤", href: "/user/profile" },
];

export function RadialMenu() {
  const [open, setOpen] = useState(false);

  // フローティングボタンの位置（画面左上から）
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    pointerX: number;
    pointerY: number;
  } | null>(null);
  const longPressTimerRef = useRef<number | null>(null);

  // 初期位置: 右下あたり
  useEffect(() => {
    const margin = 24;
    const size = 64;
    const x = window.innerWidth - margin - size;
    const y = window.innerHeight - margin - size;
    setPosition({ x, y });
  }, []);

  const close = () => setOpen(false);
  const toggleOpen = () => setOpen((v) => !v);

  // ========= ドラッグ関連 =========

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = {
      x: position.x,
      y: position.y,
      pointerX: e.clientX,
      pointerY: e.clientY,
    };

    // 長押しを検出（0.2秒くらい）
    longPressTimerRef.current = window.setTimeout(() => {
      setIsDragging(true);
      setOpen(false); // ドラッグ中はメニューを閉じておく
    }, 220);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!isDragging || !dragStartRef.current) return;

    const start = dragStartRef.current;
    const dx = e.clientX - start.pointerX;
    const dy = e.clientY - start.pointerY;

    let newX = start.x + dx;
    let newY = start.y + dy;

    const margin = 16;
    const size = 64;
    const maxX = window.innerWidth - margin - size;
    const maxY = window.innerHeight - margin - size;

    newX = Math.min(Math.max(margin, newX), maxX);
    newY = Math.min(Math.max(margin, newY), maxY);

    setPosition({ x: newX, y: newY });
  }

  function clearLongPressTimer() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    clearLongPressTimer();

    if (isDragging) {
      setIsDragging(false);
    } else {
      // 普通のタップ → メニュー開閉
      toggleOpen();
    }

    dragStartRef.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  function handlePointerCancel(e: React.PointerEvent<HTMLButtonElement>) {
    clearLongPressTimer();
    setIsDragging(false);
    dragStartRef.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  // ========= レンダリング =========

  return (
    <>
      {open && (
        <button
          type="button"
          className={styles.radialOverlay}
          onClick={close}
          aria-label="メニューを閉じる"
        />
      )}

      <div
        className={`${styles.radialRoot} ${
          open ? styles.radialRootOpen : ""
        }`}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div
            className={`${styles.radialWheel} ${
                open ? styles.radialWheelOpen : ""
            }`}
            data-open={open ? "true" : "false"}
            >
            {ITEMS.map((item, index) => {
                const style: CSSProperties = {
                "--segment-index": index,
                "--segment-count": ITEMS.length,
                } as CSSProperties;

                return (
                <button
                    key={item.label}
                    type="button"
                    className={styles.radialSegment}
                    style={style}
                    onClick={() => {
                    window.location.href = item.href;
                    close();
                    }}
                >
                    <span className={styles.radialSegmentInner}>
                    <span className={styles.radialSegmentIcon}>{item.icon}</span>
                    <span className={styles.radialSegmentLabel}>{item.label}</span>
                    </span>
                </button>
                );
            })}
            </div>

        {/* 中央の丸いハンバーガーボタン */}
        <button
          type="button"
          className={`${styles.radialToggle} ${
            open ? styles.radialToggleOpen : ""
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          aria-label={
            open
              ? "メニューを閉じる（長押しで移動）"
              : "メニューを開く（長押しで移動）"
          }
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </>
  );
}
