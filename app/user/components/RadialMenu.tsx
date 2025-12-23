"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RadialMenu.module.css";


type RadialItem = {
  label: string;
  icon: string;
  href: string;
};

const ITEMS: RadialItem[] = [
  { label: "ホーム", icon: "🏠", href: "/user/mypage" },
  { label: "出席履歴", icon: "📊", href: "/user/history" },
  { label: "イベント管理", icon: "📅", href: "/user/events/management" },
  { label: "プロフィール", icon: "👤", href: "/user/profile" },
  { label: "イベント一覧", icon: "🗂️", href: "/user/events" }, 
];

export default function RadialMenu() {
  const [open, setOpen] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const startRef = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);

  const timerRef = useRef<number | null>(null);

  // 初期位置（右下）
  useEffect(() => {
    const size = 64;
    const margin = 24;
    setPosition({
      x:1490,
      y: 180,
    });
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    startRef.current = {
      x: position.x,
      y: position.y,
      px: e.clientX,
      py: e.clientY,
    };

    timerRef.current = window.setTimeout(() => {
      setDragging(true);
      setOpen(false);
    }, 220);
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging || !startRef.current) return;

    const dx = e.clientX - startRef.current.px;
    const dy = e.clientY - startRef.current.py;

    const size = 64;
    const margin = 16;

    let x = startRef.current.x + dx;
    let y = startRef.current.y + dy;

    x = Math.max(margin, Math.min(window.innerWidth - size - margin, x));
    y = Math.max(margin, Math.min(window.innerHeight - size - margin, y));

    setPosition({ x, y });
  }

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    clearTimer();

    if (!dragging) {
      setOpen((v) => !v);
    }

    setDragging(false);
    startRef.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  return (
    <>
      {open && (
        <button
          className={styles.overlay}
          onClick={() => setOpen(false)}
          aria-label="close"
        />
      )}

      <div
        className={`${styles.root} ${open ? styles.open : ""}`}
        style={{ left: position.x, top: position.y }}
      >
        <div className={styles.wheel}>
          {ITEMS.map((item, i) => (
            <button
              key={item.label}
              className={styles.item}
              style={{ ["--i" as any]: i, ["--count" as any]: ITEMS.length }}
              onClick={() => {
                window.location.href = item.href;
                setOpen(false);
              }}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </div>

        <button
          className={`${styles.toggle} ${open ? styles.toggleOpen : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => setDragging(false)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </>
  );
}
