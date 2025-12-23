import Image from "next/image";
import styles from "./UserHeader.module.css";

// ログアウトを共通化したいなら、この actions の場所に合わせて変えてOK
import { logoutParticipant } from "../mypage/actions";

type Props = {
  participant: { name: string | null; studentId: string | null } | null;
};

export default function UserHeader({ participant }: Props) {
  const name = participant?.name || "ゲスト";
  const studentId = participant?.studentId || "未登録";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Image
          src="/user-icon/vantan.svg"
          alt="VANTAN Attendance"
          width={140}
          height={32}
          className={styles.logo}
        />
        <div className={styles.titleArea}>
          <div className={styles.title}>出席管理</div>
          <div className={styles.sub}>
            {name} / {studentId}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {/* 未ログイン時はログアウトボタンを出さない */}
        {participant && (
          <form action={logoutParticipant}>
            <button type="submit" className={styles.logoutButton}>
              ログアウト
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
