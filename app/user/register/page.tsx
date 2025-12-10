"use client";

import React, { useEffect, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { registerParticipant } from "./actions";
import { useFormStatus } from "react-dom";

type RegisterFormState = {
  status: "idle" | "error" | "success";
  message: string;
};

const initialRegisterState: RegisterFormState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
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
      {pending ? "登録中..." : "登録する"}
    </button>
  );
}

export default function UserRegisterPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<
    RegisterFormState,
    FormData
  >(registerParticipant, initialRegisterState);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);

  useEffect(() => {
    if (state.status === "success") {
      router.push("/user/mypage");
    }
  }, [state.status, router]);

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

          {state.status === "error" && state.message && (
            <div className={styles.errorBox}>
              <span className={styles.errorIcon}>!</span>
              <p className={styles.errorText}>{state.message}</p>
            </div>
          )}

          <form className={styles.loginForm} action={formAction}>
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

            <label className={styles.formLabel}>
              学籍番号（任意）
              <input
                type="text"
                name="studentId"
                className={styles.formInput}
                placeholder="例）12345678"
              />
            </label>

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
                  aria-label={
                    showPassword2 ? "パスワードを隠す" : "パスワードを表示"
                  }
                >
                  <span
                    className={
                      showPassword2
                        ? styles.passwordIconOn
                        : styles.passwordIconOff
                    }
                  />
                </button>
              </div>
            </label>

            <SubmitButton />
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
