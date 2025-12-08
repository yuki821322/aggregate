// app/user/page.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function UserLandingPage() {
  return (
    <main className={styles.pageRoot}>
      {/* 細いグローバルバー */}
      <header className={styles.globalHeader}>
        <div className={styles.globalInner}>
          <p className={styles.globalText}>出席管理アプリ｜学生・参加者向けページ</p>
          <Link href="/admin" className={styles.globalAdminLink}>
            管理者の方はこちら
          </Link>
        </div>
      </header>

      {/* Auth0 風：グラデーションヒーロー（ヘッダーのみ） */}
      <section className={styles.heroHeader}>
        <div className={styles.heroHeaderInner}>
          <p className={styles.heroHeaderKicker}>ATTENDANCE PLATFORM</p>
          <h1 className={styles.heroHeaderTitle}>
            <span className={styles.heroHeaderTitleLine}>
              授業やイベントの出席を、
            </span>
            <span className={styles.heroHeaderTitleLine}>
              スマホひとつでシンプルに管理。
            </span>
          </h1>
        </div>
      </section>

      {/* メインコンテンツ（白カード） */}
      <div className={styles.pageContainer}>
        {/* ブランドバー */}
        <div className={styles.brandBar}>
          <div className={styles.brandLogoWrap}>
            <div className={styles.brandLogoBox}>
              <Image
                src="/user-iron/vantan.svg"
                alt="Attend Logo"
                width={180}
                height={40}
                className={styles.brandLogoImage}
                priority
              />
            </div>
            <span className={styles.brandTagline}>ATTENDANCE FOR STUDENTS</span>
          </div>
          <div className={styles.brandCopy}>出席を、もっとシンプルに。</div>
        </div>

        {/* ヒーローセクション */}
        <section className={styles.heroSection}>
          <div className={styles.heroMain}>
            <h2 className={styles.heroTitle}>
              授業やイベントの出席を、
              <span className={styles.heroHighlight}>スマホひとつで</span>
              完了。
            </h2>
            <p className={styles.heroLead}>
              QRコードを読み取るだけで出席登録が完了する、学生・参加者向けの出席管理アプリです。
              自分の出席状況も、あとからマイページで確認できます。
            </p>

            <div className={styles.heroActions}>
              <Link href="/user/login" className={styles.primaryButton}>
                ログイン
              </Link>
              <Link href="/user/register" className={styles.secondaryButton}>
                新規登録（はじめての方）
              </Link>
            </div>

            <p className={styles.heroNote}>
              ※ 学校や主催者から案内されたメールアドレス・ログインIDで登録してください。
            </p>
          </div>

          {/* 右側ビジュアルカード */}
          <div className={styles.heroSide}>
            <div className={styles.visualCard}>
              <div className={styles.visualLogoRow}>
                <Image
                  src="/user-iron/vantan.svg"
                  alt="Attend Logo"
                  width={140}
                  height={32}
                  className={styles.visualLogo}
                />
              </div>
              <p className={styles.visualCatch}>
                QR を読み取るだけで、<br />
                あなたの出席が記録されます。
              </p>
              <p className={styles.visualSub}>
                教室でもオンラインでも、<br />
                同じ操作で出席が完了します。
              </p>
            </div>

            <h2 className={styles.sideTitle}>このアプリでできること</h2>
            <ul className={styles.sideList}>
              <li>授業・イベントで提示される QRコードを読み取って出席登録</li>
              <li>自分の出席履歴を、マイページでいつでも確認</li>
              <li>オンライン開催のイベントでも、同じ仕組みで一元管理</li>
            </ul>
          </div>
        </section>

        {/* 3ステップの説明 */}
        <section className={styles.stepsSection}>
          <h2 className={styles.sectionTitle}>ご利用の流れ</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepIndex}>STEP 1</span>
              <h3 className={styles.stepHeading}>アカウント登録</h3>
              <p className={styles.stepText}>
                「新規登録」からアカウントを作成します。案内されたメールアドレスやログインIDを入力してください。
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepIndex}>STEP 2</span>
              <h3 className={styles.stepHeading}>ログインしてマイページへ</h3>
              <p className={styles.stepText}>
                ログインすると、出席用QRの読み取りや、出席履歴の確認ができるマイページにアクセスできます。
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepIndex}>STEP 3</span>
              <h3 className={styles.stepHeading}>授業・イベントでQRを読み取る</h3>
              <p className={styles.stepText}>
                授業やイベント開始時に提示される QRコードをスマホで読み取るだけで、出席が自動で記録されます。
              </p>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            本サービスはテスト運用中です。ご不明な点があれば、授業担当の先生・主催者までお問い合わせください。
          </p>
        </footer>
      </div>
    </main>
  );
}
