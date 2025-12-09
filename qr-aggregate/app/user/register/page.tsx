"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function UserRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // パスワード表示切り替え
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // エラー表示
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const studentId = String(formData.get("studentId") || "").trim();
    const pass1 = String(formData.get("password") || "");
    const pass2 = String(formData.get("passwordConfirm") || "");

    // ===== フロント側の簡易バリデーション =====
    if (!name) {
      setErrorMessage("名前を入力してください。");
      setIsLoading(false);
      return;
    }

    if (!pass1) {
      setErrorMessage("パスワードを入力してください。");
      setIsLoading(false);
      return;
    }

    if (pass1 !== pass2) {
      setErrorMessage("パスワードが一致していません。");
      setIsLoading(false);
      return;
    }

    // ★ 今は仮登録処理（成功したらログインへ）
    setTimeout(() => {
      router.push("/user/login");
    }, 900);
  };

  return (
    <main className={styles.pageRoot}>
      <div className={styles.bgGradient} />

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
            <h2 className={styles.cardTitle}>新規登録</h2>
          </div>

          {/* エラー表示 */}
          {errorMessage && (
            <div className={styles.errorBox}>
              <span className={styles.errorIcon}>!</span>
              <p className={styles.errorText}>{errorMessage}</p>
            </div>
          )}

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            {/* 名前 */}
            <label className={styles.formLabel}>
              名前
              <input
                type="text"
                name="name"
                className={styles.formInput}
                placeholder="例）山田 太郎"
                required
              />
            </label>

            {/* 学籍番号（任意 or 必須 → 今は必須扱いにしてない） */}
            <label className={styles.formLabel}>
              学籍番号（任意）
              <input
                type="text"
                name="studentId"
                className={styles.formInput}
                placeholder="例）12345678"
              />
            </label>

            {/* パスワード */}
            <label className={styles.formLabel}>
              パスワード
              <div className={styles.passwordField}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`${styles.formInput} ${styles.passwordInput}`}
                  placeholder="パスワードを入力"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <span
                    className={
                      showPassword ? styles.passwordIconOn : styles.passwordIconOff
                    }
                  />
                </button>
              </div>
            </label>

            {/* パスワード確認 */}
            <label className={styles.formLabel}>
              パスワード（確認）
              <div className={styles.passwordField}>
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="passwordConfirm"
                  className={`${styles.formInput} ${styles.passwordInput}`}
                  placeholder="もう一度入力してください"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword2((v) => !v)}
                >
                  <span
                    className={
                      showPassword2 ? styles.passwordIconOn : styles.passwordIconOff
                    }
                  />
                </button>
              </div>
            </label>

            {/* 送信ボタン */}
            <button
              type="submit"
              className={`${styles.loginButton} ${
                isLoading ? styles.loginButtonLoading : ""
              }`}
              disabled={isLoading}
            >
              {isLoading && <span className={styles.buttonSpinner} />}
              {isLoading ? "登録中..." : "登録する"}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p className={styles.cardFooterText}>
              すでにアカウントがありますか？
              <Link href="/user/login" className={styles.cardFooterLink}>
                ログインはこちら
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
