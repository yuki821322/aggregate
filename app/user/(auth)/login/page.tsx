"use client";

import React, { useState, useEffect } from "react";
import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import styles from "./page.module.css";
import { loginParticipant } from "./actions";

type LoginFormState = {
  status: "idle" | "error" | "success";
  message: string;
};

const initialLoginState: LoginFormState = {
  status: "idle",
  message: "",
};

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`${styles.loginButton} ${
        pending ? styles.loginButtonLoading : ""
      }`}
      disabled={pending}
    >
      {pending && <span className={styles.buttonSpinner} />}
      {pending ? "ログイン中..." : "ログイン"}
    </button>
  );
}

export default function UserLoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<LoginFormState, FormData>(
    loginParticipant,
    initialLoginState
  );

  const [showPassword, setShowPassword] = useState(false);

  // ログイン成功したらマイページへ遷移
  useEffect(() => {
    if (state.status === "success") {
      router.push("/user/mypage");
    }
  }, [state.status, router]);

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

          {/* エラー表示（サーバー側からのメッセージ） */}
          {state.status === "error" && state.message && (
            <div className={styles.errorBox}>
              <span className={styles.errorIcon}>!</span>
              <p className={styles.errorText}>{state.message}</p>
            </div>
          )}

          <form className={styles.loginForm} action={formAction}>
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
                  className={`${styles.formInput} ${styles.passwordInput}`}
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

            <LoginButton />
          </form>

          <div className={styles.cardFooter}>
            <p className={styles.cardFooterText}>
              はじめての方は
              <Link href="/user/register" className={styles.cardFooterLink}>
                新規登録はこちら
              </Link>
            </p>
          </div>

          {/* LPへのリンク */}
          <div className={styles.lpLinkArea}>
            <Link href="/" className={styles.lpLink}>
              ← トップページへ戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
