// app/admin/profile/password/PasswordChangeForm.tsx
"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import styles from "../page.module.css";
import { changePassword, type PasswordFormState } from "../actions";

const initialState: PasswordFormState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submitButton} disabled={pending}>
      {pending ? "変更中..." : "パスワードを変更する"}
    </button>
  );
}

export default function PasswordChangeForm() {
  const [state, formAction] = useActionState(changePassword, initialState);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form action={formAction} className={styles.passwordForm}>
      {/* 現在のパスワード */}
      <div className={styles.passwordFieldRow}>
        <label className={styles.passwordLabel}>現在のパスワード</label>
        <div className={styles.passwordInputWrapper}>
          <input
            name="currentPassword"
            type={showCurrent ? "text" : "password"}
            autoComplete="current-password"
            className={styles.passwordInput}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowCurrent((v) => !v)}
          >
            <img
              src="/profile-icons/eye.svg" 
              alt="表示切替"
              className={styles.eyeIcon}
            />
          </button>
        </div>
      </div>

      {/* 新しいパスワード */}
      <div className={styles.passwordFieldRow}>
        <label className={styles.passwordLabel}>新しいパスワード</label>
        <div className={styles.passwordInputWrapper}>
          <input
            name="newPassword"
            type={showNew ? "text" : "password"}
            autoComplete="new-password"
            className={styles.passwordInput}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowNew((v) => !v)}
          >
            <img
              src="/profile-icons/eye.svg"
              alt="表示切替"
              className={styles.eyeIcon}
            />
          </button>
        </div>
      </div>

      {/* 新しいパスワード確認 */}
      <div className={styles.passwordFieldRow}>
        <label className={styles.passwordLabel}>新しいパスワード（確認）</label>
        <div className={styles.passwordInputWrapper}>
          <input
            name="newPasswordConfirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            className={styles.passwordInput}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowConfirm((v) => !v)}
          >
            <img
              src="/profile-icons/eye.svg"
              alt="表示切替"
              className={styles.eyeIcon}
            />
          </button>
        </div>
      </div>

      {state.message && (
        <p
          className={
            state.status === "success"
              ? styles.formMessageSuccess
              : styles.formMessageError
          }
        >
          {state.message}
        </p>
      )}

      <div className={styles.passwordActions}>
        <SubmitButton />
      </div>
    </form>
  );
}
