// app/admin/register/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function AdminRegisterPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage =
    error === "missing"
      ? "名前とパスワードを入力してください。"
      : error === "duplicate_name"
      ? "同じ名前のユーザーが既に存在します。"
      : error === "already_has_admin"
      ? "既に管理者アカウントが存在するため、新規登録はできません。"
      : null;

  return (
    <main className={styles.pageRoot}>
      <div className={styles.card}>
        <h1 className={styles.title}>管理者アカウント新規登録</h1>
        <p className={styles.subtitle}>
          最初の管理者アカウントを作成します。ログインIDは自動生成されます。
        </p>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <form method="POST" action="/api/admin/register" className={styles.form}>
          <label className={styles.label}>
            名前
            <input type="text" name="name" className={styles.input} required />
          </label>

          <label className={styles.label}>
            パスワード
            <input
              type="password"
              name="password"
              className={styles.input}
              required
            />
          </label>

          <button type="submit" className={styles.submitButton}>
            管理者アカウントを作成
          </button>
        </form>
      </div>
    </main>
  );
}
