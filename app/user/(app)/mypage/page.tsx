import styles from "./page.module.css";
import { getCurrentParticipant } from "@/lib/auth-participant";
import { redirect } from "next/navigation";

export default async function UserMyPage() {
  // ✅ mypageは未ログインなら弾く（loginページにもヘッダー出す運用でも、ここは守れる）
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/user/login");

  const name = participant.name || "ゲスト";
  const studentId = participant.studentId || "未登録";
  const initial =
    name.trim().length > 0 ? name.trim().charAt(0).toUpperCase() : "G";

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        {/* 上段：プロフィール＋サマリー */}
        <section className={styles.topGrid}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {participant.avatarUrl ? (
                  <img
                    src={participant.avatarUrl}
                    alt={`${name}のプロフィール画像`}
                    className={styles.avatarImage}
                  />
                ) : (
                  <span className={styles.avatarInitial}>{initial}</span>
                )}
              </div>
              <div>
                <h1 className={styles.profileName}>{name}</h1>
                <p className={styles.profileMeta}>
                  学籍番号：{studentId}
                  {studentId === "未登録" ? "（未登録）" : ""}
                </p>
              </div>
            </div>
            <p className={styles.profileText}>
              授業・イベントで読み取った QR の出席履歴を確認できます。
              今日参加する予定のイベントもここからチェックできます。
            </p>
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>これまでの出席</p>
              <p className={styles.summaryValue}>12</p>
              <p className={styles.summaryHint}>今学期に出席した回数</p>
            </div>

            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>出席率</p>
              <p className={styles.summaryValue}>92%</p>
              <p className={styles.summaryHint}>欠席 1 / 遅刻 0（サンプル）</p>
            </div>

            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>本日のイベント</p>
              <p className={styles.summaryValue}>2</p>
              <p className={styles.summaryHint}>予定されている授業 / イベント</p>
            </div>
          </div>
        </section>

        {/* 下段：今日の予定 & 最近の出席履歴 */}
        <section className={styles.bottomGrid}>
          <div className={styles.blockCard}>
            <h2 className={styles.blockTitle}>本日の予定</h2>
            <ul className={styles.eventList}>
              <li className={styles.eventItem}>
                <div>
                  <p className={styles.eventName}>Web デザイン基礎</p>
                  <p className={styles.eventMeta}>
                    09:00 - 10:30 / 3号館 401教室
                  </p>
                </div>
                <span className={styles.eventStatusUpcoming}>未出席</span>
              </li>

              <li className={styles.eventItem}>
                <div>
                  <p className={styles.eventName}>チーム制作ゼミ</p>
                  <p className={styles.eventMeta}>
                    13:00 - 15:00 / 1号館 ラボ
                  </p>
                </div>
                <span className={styles.eventStatusUpcoming}>未出席</span>
              </li>
            </ul>
          </div>

          <div className={styles.blockCard}>
            <h2 className={styles.blockTitle}>最近の出席履歴</h2>
            <ul className={styles.logList}>
              <li className={styles.logItem}>
                <div>
                  <p className={styles.logName}>UI/UX デザイン演習</p>
                  <p className={styles.logMeta}>12/05 (金) 14:00 - 15:30</p>
                </div>
                <span className={styles.logStatusPresent}>出席</span>
              </li>

              <li className={styles.logItem}>
                <div>
                  <p className={styles.logName}>キャリアガイダンス</p>
                  <p className={styles.logMeta}>11/28 (金) 16:00 - 17:00</p>
                </div>
                <span className={styles.logStatusPresent}>出席</span>
              </li>

              <li className={styles.logItem}>
                <div>
                  <p className={styles.logName}>特別講演：クリエイターの仕事</p>
                  <p className={styles.logMeta}>11/21 (金) 18:00 - 19:30</p>
                </div>
                <span className={styles.logStatusAbsent}>欠席</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
