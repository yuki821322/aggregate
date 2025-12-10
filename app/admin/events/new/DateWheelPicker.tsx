// app/admin/events/new/DateWheelPicker.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type DateWheelPickerProps = {
  /** 初期値（"YYYY-MM-DD" 形式 / 未指定なら今日） */
  initialDate?: string;
};

function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDaysInMonth(year: number, month: number) {
  // month: 1-12
  return new Date(year, month, 0).getDate();
}

export default function DateWheelPicker({ initialDate }: DateWheelPickerProps) {
  const baseDateStr = initialDate ?? getTodayString();
  const [baseYear, baseMonth, baseDay] = baseDateStr
    .split("-")
    .map((v) => Number(v));

  // 年は「現在の年の -5年〜+10年」の16年分
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 16 }, (_, i) => currentYear - 5 + i),
    [currentYear]
  );

  const [year, setYear] = useState<number>(
    years.includes(baseYear) ? baseYear : currentYear
  );
  const [month, setMonth] = useState<number>(baseMonth || 1);
  const [day, setDay] = useState<number>(baseDay || 1);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );

  // 選択された年・月に応じた「日付」候補
  const days = useMemo(() => {
    const max = getDaysInMonth(year, month);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [year, month]);

  // 年 or 月を変えたときに、存在しない「日」になっていたら補正する
  useEffect(() => {
    const max = days[days.length - 1];
    if (day > max) {
      setDay(max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days.length]);

  return (
    <div className={styles.dateWheelRoot}>
      {/* 年 */}
      <div className={styles.dateWheelColumn}>
        <div className={styles.dateWheelLabel}>年</div>
        <select
          name="dateYear"
          className={styles.dateWheelSelect}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          <option value="">-</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* 月 */}
      <div className={styles.dateWheelColumn}>
        <div className={styles.dateWheelLabel}>月</div>
        <select
          name="dateMonth"
          className={styles.dateWheelSelect}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          <option value="">-</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* 日 */}
      <div className={styles.dateWheelColumn}>
        <div className={styles.dateWheelLabel}>日</div>
        <select
          name="dateDay"
          className={styles.dateWheelSelect}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
        >
          <option value="">-</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
