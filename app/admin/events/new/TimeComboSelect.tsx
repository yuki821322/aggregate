// app/admin/events/new/TimeComboSelect.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

type TimeComboSelectProps = {
  name: string; // startTime / endTime
  initialValue?: string; // "HH:MM"
};

// 00:00〜23:30 を 30分刻みで生成
const ALL_TIMES: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    ALL_TIMES.push(`${hh}:${mm}`);
  }
}

function normalizeQuery(raw: string): string {
  const q = raw.replace(/\s/g, "");
  if (!q) return "";

  // "9" → "09", "10" → "10"
  if (/^\d{1,2}$/.test(q)) {
    return q.padStart(2, "0");
  }

  // ざっくり "9:" → "09:", "9:3" → "09:3" みたいな形も一応ケア
  const m = q.match(/^(\d{1,2}):(\d{0,2})$/);
  if (m) {
    const hh = m[1].padStart(2, "0");
    const mm = m[2];
    return mm ? `${hh}:${mm}` : `${hh}:`;
  }

  return q;
}

export default function TimeComboSelect({
  name,
  initialValue,
}: TimeComboSelectProps) {
const defaultTime =
  initialValue && ALL_TIMES.includes(initialValue) ? initialValue : "";

const [selected, setSelected] = useState<string>(defaultTime);
const [query, setQuery] = useState<string>(defaultTime);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // 入力値（query）から候補を絞り込み
  const filteredTimes = useMemo(() => {
    const norm = normalizeQuery(query);
    if (!norm) return ALL_TIMES;
    return ALL_TIMES.filter((t) => t.startsWith(norm));
  }, [query]);

  // コンポーネント外クリックで閉じる
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (time: string) => {
    setSelected(time);
    setQuery(time);
    setOpen(false);
  };

  return (
    <div className={styles.timeComboRoot} ref={rootRef}>
      {/* ユーザー入力用（表示＆フィルタ） */}
      <input
        type="text"
        className={styles.input}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="時間入力"
      />

      {/* 実際に送信する値（常に正しいHH:MM） */}
      <input type="hidden" name={name} value={selected} />

      {/* 候補リスト */}
      {open && filteredTimes.length > 0 && (
        <ul className={styles.timeComboList}>
          {filteredTimes.map((t) => (
            <li
              key={t}
              className={
                t === selected
                  ? `${styles.timeComboItem} ${styles.timeComboItemActive}`
                  : styles.timeComboItem
              }
              onMouseDown={(e) => {
                e.preventDefault(); // blurで閉じる前に選択処理
                handleSelect(t);
              }}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
