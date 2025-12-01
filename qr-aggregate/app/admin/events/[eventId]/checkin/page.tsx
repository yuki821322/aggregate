// app/admin/events/[eventId]/checkin/page.tsx
"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./page.module.css";

// Scanner コンポーネント（カメラ）
const QrScanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false }
) as any;

type CheckInResult = {
  ok: boolean;
  message?: string;
  eventTitle?: string;
  participantName?: string;
  participantCode?: string | null;
  status?: string;
  checkedAt?: string;
  isFirst?: boolean;
  code?: string;
};

type PageProps = {
  params: {
    eventId: string;
  };
};

export default function EventCheckInPage({ params }: PageProps) {
  const { eventId } = params;

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const performCheckIn = async (rawToken: string) => {
    const trimmed = rawToken.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: trimmed,
          eventId, // ★ このイベント用かチェックさせる
          deviceLabel: cameraEnabled ? "イベントチェックイン（カメラ）" : "イベントチェックイン（手入力）",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setResult({
          ok: false,
          message:
            data?.message ??
            "チェックインに失敗しました。（通信エラー or 無効なコード）",
          code: data?.code,
        });
      } else {
        setResult({
          ok: true,
          eventTitle: data.eventTitle,
          participantName: data.participantName,
          participantCode: data.participantCode,
          status: data.status,
          checkedAt: data.checkedAt,
          isFirst: data.isFirst,
        });
      }
    } catch (err) {
      console.error(err);
      setResult({
        ok: false,
        message: "サーバーとの通信に失敗しました。",
      });
    } finally {
      setLoading(false);
      setToken("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    await performCheckIn(token);
  };

  const handleScan = async (value: string | string[]) => {
    if (loading) return;
    const v = Array.isArray(value) ? value[0] : value;
    if (!v) return;
    await performCheckIn(v);
  };

  const handleError = (error: unknown) => {
    console.error("QR scan error:", error);
  };

  const statusLabel = (status?: string) => {
    if (!status) return "";
    if (status === "on_time") return "出席（オンタイム）";
    if (status === "late") return "出席（遅刻）";
    if (status === "too_early") return "早すぎる打刻";
    if (status === "invalid") return "無効な打刻";
    return status;
  };

  const formattedTime = (v?: string) => {
    if (!v) return "";
    const d = new Date(v);
    return d.toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <div className={styles.pageHeaderRow}>
            <h1 className={styles.pageTitle}>イベント出席チェックイン</h1>
            <Link href={`/admin/events/${eventId}/dashboard`} className={styles.backLink}>
              ← ダッシュボードへ戻る
            </Link>
          </div>
          <p className={styles.pageSubtitle}>
            この画面は特定のイベント専用のチェックイン画面です。<br />
            他イベントの QR コードを読み取るとエラーになります。
          </p>
        </header>

        <div className={styles.cameraToggleRow}>
          <button
            type="button"
            className={
              cameraEnabled ? styles.cameraButtonActive : styles.cameraButton
            }
            onClick={() => setCameraEnabled((v) => !v)}
          >
            {cameraEnabled ? "📷 カメラを停止" : "📷 カメラで読み取る"}
          </button>
        </div>

        {cameraEnabled && (
          <section className={styles.cameraSection}>
            <div className={styles.cameraContainer}>
              <QrScanner
                onDecode={handleScan}
                onError={handleError}
                constraints={{ facingMode: "environment" }}
              />
            </div>
            <p className={styles.cameraNote}>
              QR コードをカメラにかざすと、このイベントの出席として登録されます。
            </p>
          </section>
        )}

        <section className={styles.inputSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              チェックインコード（手入力）
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="QR コードから入力された文字列"
              />
            </label>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !token.trim()}
            >
              {loading ? "送信中..." : "打刻する"}
            </button>
          </form>
        </section>

        <section className={styles.resultSection}>
          <h2 className={styles.sectionTitle}>結果</h2>

          {!result && (
            <div className={styles.placeholderBox}>
              チェックインすると、ここに結果が表示されます。
            </div>
          )}

          {result && (
            <div
              className={
                result.ok ? styles.resultCardOk : styles.resultCardError
              }
            >
              {result.ok ? (
                <>
                  <div className={styles.resultMain}>
                    <span className={styles.resultStatus}>
                      {statusLabel(result.status)}
                    </span>
                    {result.isFirst ? (
                      <span className={styles.resultBadge}>初回打刻</span>
                    ) : (
                      <span className={styles.resultBadgeSecondary}>
                        2回目以降
                      </span>
                    )}
                  </div>

                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>イベント</span>
                    <span className={styles.resultValue}>
                      {result.eventTitle}
                    </span>
                  </div>

                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>参加者</span>
                    <span className={styles.resultValue}>
                      {result.participantName}
                      {result.participantCode && (
                        <span className={styles.resultSubValue}>
                          （ID: {result.participantCode}）
                        </span>
                      )}
                    </span>
                  </div>

                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>時刻</span>
                    <span className={styles.resultValue}>
                      {formattedTime(result.checkedAt)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.resultMain}>
                    <span className={styles.resultStatusError}>エラー</span>
                    {result.code === "NOT_FOUND" && (
                      <span className={styles.resultBadgeSecondary}>
                        未登録コード
                      </span>
                    )}
                    {result.code === "WRONG_EVENT" && (
                      <span className={styles.resultBadgeSecondary}>
                        別イベントの QR
                      </span>
                    )}
                  </div>
                  <p className={styles.resultErrorMessage}>
                    {result.message ?? "チェックインに失敗しました。"}
                  </p>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
