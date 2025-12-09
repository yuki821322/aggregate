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
};

function RevealOnScroll({
  children,
  variant = "up",
  className,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
        root: null,
        rootMargin: "0px 0px -15% 0px",
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
export default function UserLandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // イントロ全体の再生時間（ロゴ → ライン → 少し見せてフェードアウト）
    const INTRO_TOTAL_MS = 2600;
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, INTRO_TOTAL_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className={cn(styles.pageRoot, showIntro && styles.pageRootIntroLock)}
    >
      {/* イントロ演出（VANTAN ロゴアニメ） */}
      <div
        className={cn(
          styles.introOverlay,
          !showIntro && styles.introOverlayHidden
        )}
      >
        <div className={styles.introLogoWrap}>
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

      {/* 細いグローバルバー */}
      <header className={styles.globalHeader}>
        <div className={styles.globalInner}>
          <div className={styles.headerBrand}>
            <Image
              src="/user-icon/vantan.svg"
              alt="Attend Logo"
              width={110}
              height={26}
              className={styles.headerBrandLogo}
              priority
            />
            <span className={styles.headerBrandText}>
              出席管理アプリ｜学生・参加者向けページ
            </span>
          </div>
          <Link href="/admin" className={styles.globalAdminLink}>
            管理者の方はこちら
          </Link>
        </div>
      </header>

      {/* ① ヒーローセクション（背景アニメ＋ロゴのみ） */}
      <section className={styles.heroSection}>
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
        </div>
      </section>

      {/* ② サービス紹介セクション */}
      <section className={styles.serviceSection}>
        <RevealOnScroll variant="up">
          <div className={styles.contentInner}>
            <div className={styles.sectionLabel}>SERVICE</div>
            <h2 className={styles.sectionTitle}>
              出席管理を、<span className={styles.sectionHighlight}>もっとラクに</span>。
            </h2>
            <p className={styles.sectionLead}>
              紙の出席表や、口頭での点呼に代わって、
              QRコードを使ったスマートな出席管理を実現します。
              学生・参加者はスマホで読み取るだけ、主催者側は出席データを自動で集計できます。
            </p>

            <div className={styles.serviceGrid}>
              <RevealOnScroll variant="up">
                <div className={styles.serviceCard}>
                  <h3 className={styles.serviceHeading}>
                    QRコードで即時チェックイン
                  </h3>
                  <p className={styles.serviceText}>
                    授業・イベント開始時に提示される QRコードを読み取るだけ。
                    数秒で出席登録が完了し、入場の待ち時間を大幅に減らせます。
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="up">
                <div className={styles.serviceCard}>
                  <h3 className={styles.serviceHeading}>
                    マイページで出席履歴を確認
                  </h3>
                  <p className={styles.serviceText}>
                    いつどの授業・イベントに出席したかを、あとから自分でチェック可能。
                    出席率の把握や、欠席の確認もカンタンです。
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="up">
                <div className={styles.serviceCard}>
                  <h3 className={styles.serviceHeading}>
                    オンライン開催にもそのまま対応
                  </h3>
                  <p className={styles.serviceText}>
                    オンライン授業・ウェビナーでも同じ仕組みで利用できます。
                    画面に表示された QRコードを読み取るだけで出席が反映されます。
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ③ 特徴セクション */}
      <section className={styles.featureSection}>
        <RevealOnScroll variant="up">
          <div className={styles.contentInner}>
            <div className={styles.sectionLabelRow}>
              <Image
                src="/user-icon/vantan.svg"
                alt="Attend Logo"
                width={80}
                height={20}
                className={styles.sectionLabelIcon}
              />
              <div className={styles.sectionLabel}>FEATURES</div>
            </div>

            <h2 className={styles.sectionTitle}>
              学生・参加者にとって
              <span className={styles.sectionHighlight}>使いやすい</span>
              ことを第一に設計。
            </h2>

            <div className={styles.featureGrid}>
              <RevealOnScroll variant="up">
                <div className={styles.featureBox}>
                  <h3 className={styles.featureHeading}>
                    シンプルな操作で迷わない
                  </h3>
                  <p className={styles.featureText}>
                    「QRコードを読み取る」→「完了画面を見る」の2ステップだけ。
                    はじめての方でも直感的に使える画面構成です。
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="up">
                <div className={styles.featureBox}>
                  <h3 className={styles.featureHeading}>スマホ一台で完結</h3>
                  <p className={styles.featureText}>
                    アプリのインストールは不要。
                    ブラウザからログインするだけで、どの端末からでも利用できます。
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="up">
                <div className={styles.featureBox}>
                  <h3 className={styles.featureHeading}>安心のログ管理</h3>
                  <p className={styles.featureText}>
                    出席ログは安全に保存され、主催者のみが確認できます。
                    不正な多重打刻を防ぐ機能も順次追加予定です。
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="up">
                <div className={styles.featureBox}>
                  <h3 className={styles.featureHeading}>
                    テスト運用から本番導入まで
                  </h3>
                  <p className={styles.featureText}>
                    小規模な授業・イベントから試験的に導入可能。
                    利用状況を見ながら、学内／社内全体への展開も検討できます。
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ④ 利用ステップ＋FAQ */}
      <section className={styles.flowSection}>
        <RevealOnScroll variant="up">
          <div className={styles.contentInner}>
            <div className={styles.sectionLabel}>HOW TO USE</div>
            <h2 className={styles.sectionTitle}>ご利用の流れ</h2>

            <div className={styles.flowGrid}>
              <RevealOnScroll variant="up">
                <div className={styles.flowBlock}>
                  <h3 className={styles.flowHeading}>STEP 1｜アカウント登録</h3>
                  <p className={styles.flowText}>
                    「はじめての方はこちら」から、案内されたメールアドレス・ログインIDを使って登録します。
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="up">
                <div className={styles.flowBlock}>
                  <h3 className={styles.flowHeading}>
                    STEP 2｜ログインしてマイページへ
                  </h3>
                  <p className={styles.flowText}>
                    ログインすると、出席用QRの読み取りや、出席履歴の確認ができるマイページにアクセスできます。
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="up">
                <div className={styles.flowBlock}>
                  <h3 className={styles.flowHeading}>
                    STEP 3｜授業・イベントでQRを読み取る
                  </h3>
                  <p className={styles.flowText}>
                    授業やイベント開始時に提示される QRコードをスマホで読み取るだけで出席が記録されます。
                  </p>
                </div>
              </RevealOnScroll>
            </div>

            <RevealOnScroll variant="fade">
              <div className={styles.faqBox}>
                <h3 className={styles.faqHeading}>よくある質問（例）</h3>
                <ul className={styles.faqList}>
                  <li>スマホを持っていない場合の対応は？</li>
                  <li>ログインに使うメールアドレスを忘れたときは？</li>
                  <li>間違えて読み取ったときの修正はできますか？</li>
                </ul>
                <p className={styles.faqNote}>
                  実際の運用では、学校・主催者ごとに FAQ や問い合わせ先が案内されます。
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </RevealOnScroll>
      </section>

      {/* ⑤ CTA セクション */}
      <section className={styles.ctaSection}>
        <RevealOnScroll variant="up">
          <div className={styles.contentInnerNarrow}>
            <h2 className={styles.ctaTitle}>
              さっそく、次の授業・イベントで<br />
              QR出席を体験してみませんか？
            </h2>
            <p className={styles.ctaText}>
              学校や主催者から案内が届いている方は、ログインしてマイページにアクセスしてください。
              はじめての方は、事前に登録を済ませておくと当日スムーズです。
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/user/login" className={styles.primaryButton}>
                ログインする
              </Link>
              <Link href="/user/register" className={styles.secondaryButton}>
                新規登録（無料）
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* フッター */}
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
