"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

// ===== 小さなユーティリティ =====
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ===== スクロール連動アニメ =====
type RevealVariant = "up" | "fade";

type RevealOnScrollProps = {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
  enabled?: boolean; // ★追加
};

function RevealOnScroll({
  children,
  variant = "up",
  className,
  enabled = true, // ★追加
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ★イントロ中は監視しない
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -15% 0px",
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]); // ★ここ重要

  return (
    <div
      ref={ref}
      className={cn(
        styles.revealBase,
        variant === "up" ? styles.revealUp : styles.revealFade,
        isVisible && styles.revealVisible,
        className
      )}
    >
      {children}
    </div>
  );
}


// ===== ページ本体 =====
export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const INTRO_TOTAL_MS = 3800;
    const timer = setTimeout(() => setShowIntro(false), INTRO_TOTAL_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={cn(styles.pageRoot, showIntro && styles.pageRootIntroLock)}>
      {/* イントロ演出（変更なし） */}
      <div className={cn(styles.introOverlay, !showIntro && styles.introOverlayHidden)}>
        <div className={styles.introLogoWrap}>
          <div className={styles.paintLayer}>
            <span className={cn(styles.paintBurst, styles.paintBurst1)} />
            <span className={cn(styles.paintBurst, styles.paintBurst2)} />
            <span className={cn(styles.paintBurst, styles.paintBurst3)} />
            <span className={cn(styles.paintBurst, styles.paintBurst4)} />
            <span className={cn(styles.paintBurst, styles.paintBurst5)} />
            <span className={cn(styles.paintBurst, styles.paintBurst6)} />
            <span className={cn(styles.paintBurst, styles.paintBurst7)} />
            <span className={cn(styles.paintBurst, styles.paintBurst8)} />
            <span className={cn(styles.paintBurst, styles.paintBurst9)} />
            <span className={cn(styles.paintBurst, styles.paintBurst10)} />
            <span className={cn(styles.paintBurst, styles.paintBurst11)} />
            <span className={cn(styles.paintBurst, styles.paintBurst12)} />
          </div>

          <div className={styles.introLogoWord}>
            <span className={styles.introLetter}>V</span>
            <span className={styles.introLetter}>A</span>
            <span className={styles.introLetter}>N</span>
            <span className={styles.introLetter}>T</span>
            <span className={styles.introLetter}>A</span>
            <span className={styles.introLetter}>N</span>
          </div>
          <div className={styles.introLine} />
        </div>
      </div>

      {/* グローバルバー（文言だけ：統合アプリへ） */}
      <header className={styles.globalHeader}>
        <div className={styles.globalInner}>
          <div className={styles.headerBrand}>
            <Image
              src="/user-icon/vantan.svg"
              alt="VANTAN"
              width={110}
              height={26}
              className={styles.headerBrandLogo}
              priority
            />
            <span className={styles.headerBrandText}>
              統合イベント管理アプリ｜参加者（User）/ 運営（Admin）
            </span>
          </div>

          <nav className={styles.globalNav}>
            <Link href="/user/login" className={cn(styles.navLink, styles.navLinkUser)}>
              Userログイン
            </Link>
            <Link href="/admin" className={cn(styles.navLink, styles.navLinkAdmin)}>
              Adminへ
            </Link>
          </nav>
        </div>
      </header>

      {/* ヒーロー（VANTAN演出は維持、下に説明を追加） */}
      <section className={styles.heroSection}>
        <div className={styles.heroOrbLayer}>
          <span className={cn(styles.heroOrb, styles.heroOrb1)} />
          <span className={cn(styles.heroOrb, styles.heroOrb2)} />
          <span className={cn(styles.heroOrb, styles.heroOrb3)} />
          <span className={cn(styles.heroOrb, styles.heroOrb4)} />
        </div>

        <div className={styles.heroInnerCenter}>
          <div className={styles.heroLogoMain}>
            <span className={styles.heroLogoLetter}>V</span>
            <span className={styles.heroLogoLetter}>A</span>
            <span className={styles.heroLogoLetter}>N</span>
            <span className={styles.heroLogoLetter}>T</span>
            <span className={styles.heroLogoLetter}>A</span>
            <span className={styles.heroLogoLetter}>N</span>
          </div>
          <div className={styles.heroLogoLine} />

          <div className={styles.heroCopy}>
            <p className={styles.heroLead}>
              参加者は「QRでチェックイン」。
              運営は「イベント作成・参加者管理・出席ログ集計」。
              <br />
              <span className={styles.heroLeadStrong}>User / Admin をひとつのアプリで</span>
              使えるように設計しています。
            </p>
          </div>
        </div>
      </section>

      {/* ★ 追加：User / Admin 選択セクション（導線の色分け） */}
      <section className={styles.roleSection}>
        <RevealOnScroll variant="up">
          <div className={styles.contentInner}>
            <div className={styles.sectionLabel}>START HERE</div>
            <h2 className={styles.sectionTitle}>
              あなたはどちらですか？
              <span className={styles.sectionHighlight}>（User / Admin）</span>
            </h2>
            <p className={styles.sectionLead}>
              参加者向けページと、運営（管理者）向けページを分けて用意しています。
              自分の立場に合う入口から進んでください。
            </p>

            <div className={styles.roleGrid}>
              {/* User */}
              <div className={cn(styles.roleCard, styles.roleCardUser)}>
                <div className={styles.roleHead}>
                  <div className={styles.roleBadgeUser}>USER</div>
                  <div className={styles.roleTitle}>イベントに参加する方</div>
                </div>
                <ul className={styles.roleList}>
                  <li>QRコードでチェックイン（出席/受付）</li>
                  <li>マイページで参加履歴を確認</li>
                  <li>スマホだけで迷わず操作</li>
                </ul>
                <div className={styles.roleButtons}>
                  <Link href="/user/login" className={cn(styles.rolePrimary, styles.rolePrimaryUser)}>
                    Userログイン（赤×白）
                  </Link>
                  <Link href="/user/register" className={cn(styles.roleSecondary, styles.roleSecondaryUser)}>
                    User新規登録
                  </Link>
                </div>
              </div>

              {/* Admin */}
              <div className={cn(styles.roleCard, styles.roleCardAdmin)}>
                <div className={styles.roleHead}>
                  <div className={styles.roleBadgeAdmin}>ADMIN</div>
                  <div className={styles.roleTitle}>イベントを作成・管理する方</div>
                </div>
                <ul className={styles.roleList}>
                  <li>イベント作成・編集（開催情報を管理）</li>
                  <li>参加者管理／出席ログの確認・集計</li>
                  <li>運営の手間を減らしてスムーズに進行</li>
                </ul>
                <div className={styles.roleButtons}>
                  <Link href="/admin" className={cn(styles.rolePrimary, styles.rolePrimaryAdmin)}>
                    Adminへ（青×白）
                  </Link>
                  <Link href="/admin/login" className={cn(styles.roleSecondary, styles.roleSecondaryAdmin)}>
                    Adminログイン
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* サービス紹介（User/Adminを並列で） */}
      <section className={styles.serviceSection}>
        <RevealOnScroll variant="up">
          <div className={styles.contentInner}>
            <div className={styles.sectionLabel}>SERVICE</div>
            <h2 className={styles.sectionTitle}>
              出席管理を、<span className={styles.sectionHighlight}>もっとラクに</span>。
            </h2>

            <div className={styles.dualGrid}>
              {/* User側 */}
              <div className={styles.dualBlock}>
                <div className={cn(styles.dualTag, styles.dualTagUser)}>User</div>
                <p className={styles.dualLead}>
                  QRコード読み取りで、受付・出席をすばやく完了。
                  履歴もマイページで確認できます。
                </p>

                <div className={styles.serviceGrid}>
                  <div className={styles.serviceCard}>
                    <h3 className={styles.serviceHeading}>QRコードで即時チェックイン</h3>
                    <p className={styles.serviceText}>
                      授業・イベント開始時に提示される QRコードを読み取るだけ。
                      数秒で出席登録が完了します。
                    </p>
                  </div>

                  <div className={styles.serviceCard}>
                    <h3 className={styles.serviceHeading}>マイページで出席履歴を確認</h3>
                    <p className={styles.serviceText}>
                      いつどの授業・イベントに出席したかを、あとから自分でチェック可能です。
                    </p>
                  </div>

                  <div className={styles.serviceCard}>
                    <h3 className={styles.serviceHeading}>オンライン開催にも対応</h3>
                    <p className={styles.serviceText}>
                      オンライン授業・ウェビナーでも同じ仕組みで利用できます。
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin側 */}
              <div className={styles.dualBlock}>
                <div className={cn(styles.dualTag, styles.dualTagAdmin)}>Admin</div>
                <p className={styles.dualLead}>
                  イベント作成から、参加者・出席ログの確認まで。
                  運営に必要な機能を管理画面に集約します。
                </p>

                <div className={styles.serviceGrid}>
                  <div className={styles.serviceCard}>
                    <h3 className={styles.serviceHeading}>イベント作成・編集</h3>
                    <p className={styles.serviceText}>
                      日程・内容を管理し、参加者へ案内しやすい形で運用できます。
                    </p>
                  </div>

                  <div className={styles.serviceCard}>
                    <h3 className={styles.serviceHeading}>参加者管理</h3>
                    <p className={styles.serviceText}>
                      誰が参加しているかを把握し、必要に応じて確認・対応ができます。
                    </p>
                  </div>

                  <div className={styles.serviceCard}>
                    <h3 className={styles.serviceHeading}>出席ログ・集計</h3>
                    <p className={styles.serviceText}>
                      チェックイン結果を自動で保存・集計。運営の手作業を減らします。
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </RevealOnScroll>
      </section>

      {/* 利用ステップ（User/Admin でわかるように調整） */}
      <section className={styles.flowSection}>
        <RevealOnScroll variant="up">
          <div className={styles.contentInner}>
            <div className={styles.sectionLabel}>HOW TO USE</div>
            <h2 className={styles.sectionTitle}>ご利用の流れ</h2>

            <div className={styles.flowGrid}>
              <div className={styles.flowBlock}>
                <h3 className={styles.flowHeading}>User｜QRでチェックイン</h3>
                <p className={styles.flowText}>
                  ログイン → マイページ → 授業/イベントのQRを読み取り → 出席が記録されます。
                </p>
              </div>

              <div className={styles.flowBlock}>
                <h3 className={styles.flowHeading}>Admin｜イベントを作る</h3>
                <p className={styles.flowText}>
                  管理画面でイベントを作成・編集し、参加者に案内します。
                </p>
              </div>

              <div className={styles.flowBlock}>
                <h3 className={styles.flowHeading}>Admin｜ログを確認・集計</h3>
                <p className={styles.flowText}>
                  チェックイン結果をログで確認し、集計や運営判断に活用できます。
                </p>
              </div>
            </div>

            <div className={styles.faqBox}>
              <h3 className={styles.faqHeading}>よくある質問（例）</h3>
              <ul className={styles.faqList}>
                <li>スマホを持っていない場合の対応は？</li>
                <li>Userのログイン情報を忘れたときは？</li>
                <li>読み取りミスの修正はできますか？</li>
              </ul>
              <p className={styles.faqNote}>
                実運用では、学校・主催者ごとに問い合わせ先やFAQを案内します。
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* CTA（User/Adminを並列） */}
      <section className={styles.ctaSection}>
        <RevealOnScroll variant="up">
          <div className={styles.contentInner}>
            <h2 className={styles.ctaTitle}>
              入口を選んで、すぐに使い始める
            </h2>
            <p className={styles.ctaText}>
              参加者は User から。運営は Admin から。
              迷わず入れるよう、導線を色分けしています。
            </p>

            <div className={styles.ctaDualButtons}>
              {/* <div className={styles.ctaCol}>
                <Link href="/user/login" className={cn(styles.primaryButton, styles.primaryButtonUser)}>
                  Userログイン
                </Link>
                <Link href="/user/register" className={cn(styles.secondaryButton, styles.secondaryButtonUser)}>
                  User新規登録
                </Link>
              </div> */}

              {/* <div className={styles.ctaCol}>
                <Link href="/admin" className={cn(styles.primaryButton, styles.primaryButtonAdmin)}>
                  Adminへ
                </Link>
                <Link href="/admin/login" className={cn(styles.secondaryButton, styles.secondaryButtonAdmin)}>
                  Adminログイン
                </Link>
              </div> */}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            本サービスはテスト運用中です。ご不明な点があれば、授業担当の先生・主催者までお問い合わせください。
          </p>
        </div>
      </footer>
    </main>
  );
}
