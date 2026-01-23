// app/admin/login/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage =
    error === "missing"
      ? "「名前 または ログインID」と「パスワード」を入力してください。"
      : error === "invalid"
      ? "入力内容が正しくありません。"
      : null;

  return (
    <main className={styles.pageRoot}>
      <div className={styles.card}>
        <h1 className={styles.title}>管理者ログイン</h1>
        <p className={styles.subtitle}>
          管理画面にアクセスするには、管理者アカウントでログインしてください。
        </p>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <form method="POST" action="/api/admin/login" className={styles.form}>
          <label className={styles.label}>
            名前 または ログインID
            <input
              type="text"
              name="username"        // ★ ここを username に変更
              className={styles.input}
              autoComplete="username"
              required
            />
          </label>

          <label className={styles.label}>
            パスワード
            <input
              type="password"
              name="password"
              className={styles.input}
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className={styles.submitButton}>
            ログイン
          </button>
        </form>

        <p className={styles.registerText}>
          初めてご利用の方は{" "}
          <a href="/admin/register" className={styles.registerLink}>
            管理者アカウントを新規登録
          </a>
        </p>

        {/* LPへのリンク */}
        <div className={styles.lpLinkArea}>
          <a href="/" className={styles.lpLink}>
            ← トップページへ戻る
          </a>
        </div>
      </div>
    </main>
  );
}
