"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
// ★ パスを 1つ上の階層に修正
import styles from "../page.module.css";
// ★ actions も profile 直下にあるので 1つ上
import { changePassword, type PasswordFormState } from "../actions";

const initialState: PasswordFormState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={styles.submitButton}
      disabled={pending}
    >
      {pending ? "変更中..." : "パスワードを変更する"}
    </button>
  );
}

export default function PasswordChangeForm() {
  const [state, formAction] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className={styles.passwordForm}>
      <div className={styles.passwordFieldRow}>
        <label htmlFor="currentPassword" className={styles.passwordLabel}>
          現在のパスワード
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          className={styles.passwordInput}
          required
        />
      </div>

      <div className={styles.passwordFieldRow}>
        <label htmlFor="newPassword" className={styles.passwordLabel}>
          新しいパスワード
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          className={styles.passwordInput}
          required
        />
      </div>

      <div className={styles.passwordFieldRow}>
        <label
          htmlFor="newPasswordConfirm"
          className={styles.passwordLabel}
        >
          新しいパスワード（確認）
        </label>
        <input
          id="newPasswordConfirm"
          name="newPasswordConfirm"
          type="password"
          autoComplete="new-password"
          className={styles.passwordInput}
          required
        />
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
