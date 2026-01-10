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
  enabled?: boolean;
};

function RevealOnScroll({
  children,
  variant = "up",
  className,
  enabled = true,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
  }, [enabled]);

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
    const INTRO_TOTAL_MS = 4800;
    const timer = setTimeout(() => setShowIntro(false), INTRO_TOTAL_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={cn(styles.pageRoot, showIntro && styles.pageRootIntroLock)}>
      {/* イントロ演出 */}
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

      {/* グローバルヘッダー */}
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

      {/* ヒーロー */}
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

          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              イベント管理を、もっとシンプルに。
            </h1>
            <p className={styles.heroLead}>
              参加者は QR コードでチェックイン。<br />
              運営はイベント作成から出席管理まで。<br />
              <span className={styles.heroLeadStrong}>すべてがひとつのアプリで完結します。</span>
            </p>
          </div>
        </div>
      </section>

      {/* User / Admin 選択セクション */}
      <section className={styles.roleSection}>
        <RevealOnScroll variant="up" enabled={!showIntro}>
          <div className={styles.contentInner}>
            <h2 className={styles.sectionTitle}>
              どちらかを選んでください
            </h2>
            <p className={styles.sectionLead}>
              参加者の方は User から、運営の方は Admin からお進みください。
            </p>

            <div className={styles.roleGrid}>
              {/* User */}
              <div className={cn(styles.roleCard, styles.roleCardUser)}>
                <div className={styles.roleIcon}>👤</div>
                <h3 className={styles.roleTitle}>参加者の方</h3>
                <p className={styles.roleDescription}>
                  イベントや授業に参加する方はこちら
                </p>
                
                <ul className={styles.roleList}>
                  <li>QR コードで簡単チェックイン</li>
                  <li>参加履歴をいつでも確認</li>
                  <li>スマホだけで完結</li>
                </ul>
                
                <div className={styles.roleButtons}>
                  <Link href="/user/login" className={cn(styles.roleButton, styles.roleButtonUser)}>
                    User ログイン
                  </Link>
                  <Link href="/user/register" className={styles.roleButtonSecondary}>
                    新規登録
                  </Link>
                </div>
              </div>

              {/* Admin */}
              <div className={cn(styles.roleCard, styles.roleCardAdmin)}>
                <div className={styles.roleIcon}>⚙️</div>
                <h3 className={styles.roleTitle}>運営の方</h3>
                <p className={styles.roleDescription}>
                  イベントを作成・管理する方はこちら
                </p>
                
                <ul className={styles.roleList}>
                  <li>イベントの作成と編集</li>
                  <li>参加者の管理</li>
                  <li>出席データの集計</li>
                </ul>
                
                <div className={styles.roleButtons}>
                  <Link href="/admin" className={cn(styles.roleButton, styles.roleButtonAdmin)}>
                    Admin へ
                  </Link>
                  <Link href="/admin/login" className={styles.roleButtonSecondary}>
                    ログイン
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 機能紹介 */}
      <section className={styles.featureSection}>
        <RevealOnScroll variant="up" enabled={!showIntro}>
          <div className={styles.contentInner}>
            <h2 className={styles.sectionTitle}>主な機能</h2>

            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📱</div>
                <h3 className={styles.featureTitle}>QR チェックイン</h3>
                <p className={styles.featureText}>
                  スマホで QR コードを読み取るだけ。数秒で出席登録が完了します。
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📋</div>
                <h3 className={styles.featureTitle}>履歴確認</h3>
                <p className={styles.featureText}>
                  マイページでいつでも参加履歴を確認できます。
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <h3 className={styles.featureTitle}>イベント管理</h3>
                <p className={styles.featureText}>
                  運営側はイベント作成から参加者管理まで一元管理。
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📈</div>
                <h3 className={styles.featureTitle}>データ集計</h3>
                <p className={styles.featureText}>
                  出席データを自動で集計。手作業の負担を削減します。
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 利用の流れ */}
      <section className={styles.flowSection}>
        <RevealOnScroll variant="up" enabled={!showIntro}>
          <div className={styles.contentInner}>
            <h2 className={styles.sectionTitle}>ご利用の流れ</h2>

            <div className={styles.flowGrid}>
              <div className={styles.flowStep}>
                <div className={styles.flowNumber}>1</div>
                <h3 className={styles.flowTitle}>アカウント作成</h3>
                <p className={styles.flowText}>
                  User または Admin でアカウントを作成します。
                </p>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.flowNumber}>2</div>
                <h3 className={styles.flowTitle}>ログイン</h3>
                <p className={styles.flowText}>
                  メールアドレスとパスワードでログインします。
                </p>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.flowNumber}>3</div>
                <h3 className={styles.flowTitle}>利用開始</h3>
                <p className={styles.flowText}>
                  User はチェックイン、Admin はイベント管理ができます。
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <RevealOnScroll variant="up" enabled={!showIntro}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>
              今すぐ始める
            </h2>
            <p className={styles.ctaText}>
              アカウントを作成して、すぐに利用できます。
            </p>

            <div className={styles.ctaButtons}>
              <Link href="/user/login" className={cn(styles.ctaButton, styles.ctaButtonUser)}>
                User としてログイン
              </Link>
              <Link href="/admin" className={cn(styles.ctaButton, styles.ctaButtonAdmin)}>
                Admin へ
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            © 2026 VANTAN Event Management System
          </p>
          <p className={styles.footerNote}>
            本サービスはテスト運用中です。ご不明な点は担当者までお問い合わせください。
          </p>
        </div>
      </footer>
    </main>
  );
}