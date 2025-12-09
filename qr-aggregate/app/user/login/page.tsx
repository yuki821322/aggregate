"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function UserLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const identifier = String(formData.get("identifier") || "").trim();
    const password = String(formData.get("password") || "");

    // ★ 仮ロジック：
    //   password が "error" のときだけエラーにして UI を確認できるようにしてある
    const shouldFail = password === "error" || identifier.length === 0;

    setTimeout(() => {
      if (shouldFail) {
        setErrorMessage(
          "ログインに失敗しました。名前 / 学籍番号 と パスワードをご確認ください。"
        );
        setIsLoading(false);
      } else {
        // 成功したらマイページへ
        router.push("/user/mypage");
      }
    }, 900);
  };

  return (
    <main className={styles.pageRoot}>
      {/* 背景グラデーション */}
      <div className={styles.bgGradient} />

      {/* 中央のログインカード */}
      <div className={styles.centerWrap}>
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <Image
              src="/user-icon/vantan.svg"
              alt="VANTAN Attendance"
              width={120}
              height={30}
              className={styles.cardLogo}
            />
            <h2 className={styles.cardTitle}>ログイン</h2>
          </div>

          {/* エラー表示 */}
          {errorMessage && (
            <div className={styles.errorBox}>
              <span className={styles.errorIcon}>!</span>
              <p className={styles.errorText}>{errorMessage}</p>
            </div>
          )}

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <label className={styles.formLabel}>
              名前 または 学籍番号
              <input
                type="text"
                name="identifier"
                autoComplete="username"
                className={styles.formInput}
                placeholder="例）山田 太郎 / 12345678"
                required
              />
            </label>

            <label className={styles.formLabel}>
                パスワード
                <div className={styles.passwordField}>
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    className={`${styles.formInput} ${styles.passwordInput}`} // ★ ここ
                    placeholder="パスワードを入力"
                    required
                    />
                    <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                    >
                    <span
                        className={
                        showPassword
                            ? styles.passwordIconOn
                            : styles.passwordIconOff
                        }
                    />
                    </button>
                </div>
                </label>

            <button
              type="submit"
              className={`${styles.loginButton} ${
                isLoading ? styles.loginButtonLoading : ""
              }`}
              disabled={isLoading}
            >
              {isLoading && <span className={styles.buttonSpinner} />}
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p className={styles.cardFooterText}>
              はじめての方は
              <Link href="/user/register" className={styles.cardFooterLink}>
                新規登録はこちら
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
