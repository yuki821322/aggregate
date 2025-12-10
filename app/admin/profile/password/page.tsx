// app/admin/profile/password/page.tsx
import Link from "next/link";
import styles from "../page.module.css";
import PasswordChangeForm from "./PasswordChangeForm";

export default function PasswordChangePage() {
  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>

        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>パスワード変更</h1>
            <p className={styles.pageSubtitle}>
              現在のパスワードを確認し、新しいパスワードを設定してください。
            </p>
          </div>

          <Link href="/admin/profile" className={styles.backLink}>
            ← プロフィールに戻る
          </Link>
        </header>

        <section className={styles.passwordSection}>
          <PasswordChangeForm />
        </section>

      </div>
    </main>
  );
}
