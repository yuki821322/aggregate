// app/admin/checkin/page.tsx
"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

// QR スキャナを SSR 無効で読み込み
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

export default function CheckInPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 共通のチェックイン処理（フォーム & カメラ 両方から呼ぶ）
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
          deviceLabel: cameraEnabled ? "管理画面カメラ" : "管理画面端末A",
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
    if (loading) return; // 連続ヒット防止

    const v = Array.isArray(value) ? value[0] : value;
    if (!v) return;

    // カメラが同じコードを連続で送ってくることがあるので、
    // 連打防止的にちょっと間引いても良いが、まずはそのまま実行
    await performCheckIn(v);
  };

  const handleError = (error: unknown) => {
    console.error("QR scan error:", error);
    // UI上ではとりあえず何も出さない（うるさくなるので）
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
          <h1 className={styles.pageTitle}>出席チェックイン</h1>
          <p className={styles.pageSubtitle}>
            QR リーダー入力 or カメラ読み取りで、参加者の出席を登録します。
          </p>
        </header>

        {/* カメラ切り替えボタン */}
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

        {/* カメラビュー */}
        {cameraEnabled && (
          <section className={styles.cameraSection}>
            <div className={styles.cameraContainer}>
              <QrScanner
                onDecode={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: "environment", // 背面カメラ優先（スマホ時）
                }}
              />
            </div>
            <p className={styles.cameraNote}>
              QR コードをカメラにかざすと、自動的にチェックイン処理が走ります。
            </p>
          </section>
        )}

        {/* 入力エリア（QRリーダー/手入力用） */}
        <section className={styles.inputSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              チェックインコード
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

        {/* 結果エリア */}
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
