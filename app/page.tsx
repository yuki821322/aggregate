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
type RevealVariant = "up" | "fade" | "left" | "right";

type RevealOnScrollProps = {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
  enabled?: boolean;
  delay?: number;
};

function RevealOnScroll({
  children,
  variant = "up",
  className,
  enabled = true,
  delay = 0,
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
            setTimeout(() => setIsVisible(true), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, delay]);

  return (
    <div
      ref={ref}
      className={cn(
        styles.revealBase,
        variant === "up" && styles.revealUp,
        variant === "fade" && styles.revealFade,
        variant === "left" && styles.revealLeft,
        variant === "right" && styles.revealRight,
        isVisible && styles.revealVisible,
        className
      )}
    >
      {children}
    </div>
  );
}

// ===== 背景装飾コンポーネント =====
function BackgroundDecoration() {
  return (
    <div className={styles.bgDecoration}>
      <div className={cn(styles.bgBlob, styles.bgBlob1)} />
      <div className={cn(styles.bgBlob, styles.bgBlob2)} />
      <div className={cn(styles.bgBlob, styles.bgBlob3)} />
      <div className={styles.bgGrid} />
    </div>
  );
}

// ===== ページ本体 =====
export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const INTRO_TOTAL_MS = 3500;
    const timer = setTimeout(() => setShowIntro(false), INTRO_TOTAL_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={cn(styles.pageRoot, showIntro && styles.pageRootIntroLock)}>
      {/* イントロ演出 - 雷エフェクト */}
      <div className={cn(styles.introOverlay, !showIntro && styles.introOverlayHidden)}>
        <div className={styles.lightningLayer}>
          <div className={cn(styles.lightning, styles.lightning1)} />
          <div className={cn(styles.lightning, styles.lightning2)} />
          <div className={cn(styles.lightning, styles.lightning3)} />
          <div className={cn(styles.lightning, styles.lightning4)} />
          <div className={cn(styles.lightning, styles.lightning5)} />
        </div>

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

      {/* グローバルヘッダー */}
      <header className={styles.globalHeader}>
        <div className={styles.globalInner}>
          <div className={styles.headerBrand}>
            <div className={styles.headerLogoBox}>
              <Image
                src="/user-icon/vantan.svg"
                alt="VANTAN"
                width={120}
                height={28}
                className={styles.headerBrandLogo}
                priority
              />
            </div>
            <span className={styles.headerBrandText}>
              イベント統合管理システム
            </span>
          </div>

          <nav className={styles.globalNav}>
            <div className={styles.navGroup}>
              <span className={styles.navGroupLabel}>
                <span className={styles.navIcon}>
                  <Image
                    src="/human.svg"
                    alt="User"
                    width={18}
                    height={18}
                  />
                </span>
                参加者
              </span>
              <div className={styles.navButtons}>
                <Link href="/user/login" className={cn(styles.navLink, styles.navLinkUser)}>
                  ログイン
                </Link>
                <Link href="/user/register" className={cn(styles.navLink, styles.navLinkUserSecondary)}>
                  新規登録
                </Link>
              </div>
            </div>
            
            <div className={styles.navDivider} />
            
            <div className={styles.navGroup}>
              <span className={styles.navGroupLabel}>
                <span className={styles.navIcon}>
                  <Image
                    src="/gear.svg"
                    alt="Admin"
                    width={18}
                    height={18}
                  />
                </span>
                運営
              </span>
              <div className={styles.navButtons}>
                <Link href="/admin/login" className={cn(styles.navLink, styles.navLinkAdmin)}>
                  ログイン
                </Link>
                <Link href="/admin/register" className={cn(styles.navLink, styles.navLinkAdminSecondary)}>
                  新規登録
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* ヒーロー */}
      <section className={styles.heroSection}>
        <BackgroundDecoration />
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
              イベント管理を、<br className={styles.heroTitleBr} />
              <span className={styles.heroTitleGradient}>もっとシンプルに。</span>
            </h1>
            <p className={styles.heroLead}>
              QRコードで瞬時にチェックイン。データは自動で集計。<br />
              参加者も運営も、すべてがスムーズになる統合管理システム。
            </p>
          </div>

          <div className={styles.heroActions}>
            <Link href="#start" className={cn(styles.heroButton, styles.heroButtonPrimary)}>
              <span>今すぐ始める</span>
              <span className={styles.heroButtonArrow}>→</span>
            </Link>
            <Link href="#features" className={cn(styles.heroButton, styles.heroButtonSecondary)}>
              <span>機能を見る</span>
            </Link>
          </div>
        </div>
      </section>

      {/* User / Admin 選択セクション */}
      <section className={styles.roleSection} id="start">
        <div className={styles.contentInner}>
          <RevealOnScroll variant="up" enabled={!showIntro}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>START</div>
              <h2 className={styles.sectionTitle}>
                ご利用方法を選択
              </h2>
              <p className={styles.sectionLead}>
                参加者の方はUser、運営の方はAdminをお選びください
              </p>
            </div>
          </RevealOnScroll>

          <div className={styles.roleGrid}>
            {/* User */}
            <RevealOnScroll variant="left" enabled={!showIntro} delay={100}>
              <div className={cn(styles.roleCard, styles.roleCardUser)}>
                <div className={styles.roleCardGlow} />
                <div className={styles.roleIconLarge}>
                  <Image
                    src="/human.svg"
                    alt="User"
                    width={56}
                    height={56}
                  />
                </div>
                <h3 className={styles.roleTitle}>参加者（User）</h3>
                <p className={styles.roleDescription}>
                  イベントや授業に参加する方向け
                </p>
                
                <ul className={styles.roleList}>
                  <li>
                    <span className={styles.roleListIcon}>✓</span>
                    <span>QRコードで簡単チェックイン</span>
                  </li>
                  <li>
                    <span className={styles.roleListIcon}>✓</span>
                    <span>参加履歴をいつでも確認</span>
                  </li>
                  <li>
                    <span className={styles.roleListIcon}>✓</span>
                    <span>スマホだけで完結</span>
                  </li>
                </ul>
                
                <div className={styles.roleButtons}>
                  <Link href="/user/login" className={cn(styles.roleButton, styles.roleButtonUser)}>
                    <span>ログイン</span>
                    <span className={styles.roleButtonArrow}>→</span>
                  </Link>
                  <Link href="/user/register" className={styles.roleButtonSecondary}>
                    新規登録はこちら
                  </Link>
                </div>
              </div>
            </RevealOnScroll>

            {/* Admin */}
            <RevealOnScroll variant="right" enabled={!showIntro} delay={200}>
              <div className={cn(styles.roleCard, styles.roleCardAdmin)}>
                <div className={styles.roleCardGlow} />
                <div className={styles.roleIconLarge}>
                  <Image
                    src="/gear.svg"
                    alt="Admin"
                    width={56}
                    height={56}
                  />
                </div>
                <h3 className={styles.roleTitle}>運営（Admin）</h3>
                <p className={styles.roleDescription}>
                  イベントを作成・管理する方向け
                </p>
                
                <ul className={styles.roleList}>
                  <li>
                    <span className={styles.roleListIcon}>✓</span>
                    <span>イベントの作成と編集</span>
                  </li>
                  <li>
                    <span className={styles.roleListIcon}>✓</span>
                    <span>参加者の管理</span>
                  </li>
                  <li>
                    <span className={styles.roleListIcon}>✓</span>
                    <span>出席データの集計</span>
                  </li>
                </ul>
                
                <div className={styles.roleButtons}>
                  <Link href="/admin/login" className={cn(styles.roleButton, styles.roleButtonAdmin)}>
                    <span>ログイン</span>
                    <span className={styles.roleButtonArrow}>→</span>
                  </Link>
                  <Link href="/admin/register" className={styles.roleButtonSecondary}>
                    新規登録はこちら
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className={styles.featureSection} id="features">
        <div className={styles.contentInner}>
          <RevealOnScroll variant="up" enabled={!showIntro}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>FEATURES</div>
              <h2 className={styles.sectionTitle}>主な機能</h2>
              <p className={styles.sectionLead}>
                シンプルで直感的。必要な機能がすべて揃っています
              </p>
            </div>
          </RevealOnScroll>

          <div className={styles.featureGrid}>
            <RevealOnScroll variant="up" enabled={!showIntro} delay={0}>
              <div className={cn(styles.featureCard, styles.featureCardRed)}>
                <div className={styles.featureCardGlow} />
                <div className={styles.featureIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>QRチェックイン</h3>
                <p className={styles.featureText}>
                  スマホでQRコードを読み取るだけ。<br />数秒で出席登録が完了します。
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="up" enabled={!showIntro} delay={100}>
              <div className={cn(styles.featureCard, styles.featureCardRed)}>
                <div className={styles.featureCardGlow} />
                <div className={styles.featureIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>履歴確認</h3>
                <p className={styles.featureText}>
                  マイページでいつでも<br />参加履歴を確認できます。
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="up" enabled={!showIntro} delay={200}>
              <div className={cn(styles.featureCard, styles.featureCardBlue)}>
                <div className={styles.featureCardGlow} />
                <div className={styles.featureIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>イベント管理</h3>
                <p className={styles.featureText}>
                  運営側はイベント作成から<br />参加者管理まで一元管理。
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="up" enabled={!showIntro} delay={300}>
              <div className={cn(styles.featureCard, styles.featureCardBlue)}>
                <div className={styles.featureCardGlow} />
                <div className={styles.featureIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>データ集計</h3>
                <p className={styles.featureText}>
                  出席データを自動で集計。<br />手作業の負担を削減します。
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 利用の流れ */}
      <section className={styles.flowSection}>
        <div className={styles.contentInner}>
          <RevealOnScroll variant="up" enabled={!showIntro}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>HOW TO USE</div>
              <h2 className={styles.sectionTitle}>ご利用の流れ</h2>
              <p className={styles.sectionLead}>
                たった3ステップですぐに始められます
              </p>
            </div>
          </RevealOnScroll>

          <div className={styles.flowContainer}>
            <RevealOnScroll variant="up" enabled={!showIntro} delay={0}>
              <div className={styles.flowStep}>
                <div className={styles.flowNumber}>01</div>
                <h3 className={styles.flowTitle}>アカウント作成</h3>
                <p className={styles.flowText}>
                  UserまたはAdminで<br />アカウントを作成
                </p>
              </div>
            </RevealOnScroll>

            <div className={styles.flowArrow}>→</div>

            <RevealOnScroll variant="up" enabled={!showIntro} delay={100}>
              <div className={styles.flowStep}>
                <div className={styles.flowNumber}>02</div>
                <h3 className={styles.flowTitle}>ログイン</h3>
                <p className={styles.flowText}>
                  メールアドレスと<br />パスワードでログイン
                </p>
              </div>
            </RevealOnScroll>

            <div className={styles.flowArrow}>→</div>

            <RevealOnScroll variant="up" enabled={!showIntro} delay={200}>
              <div className={styles.flowStep}>
                <div className={styles.flowNumber}>03</div>
                <h3 className={styles.flowTitle}>利用開始</h3>
                <p className={styles.flowText}>
                  チェックイン or<br />イベント管理を開始
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoBox}>
                <Image
                  src="/user-icon/vantan.svg"
                  alt="VANTAN"
                  width={140}
                  height={32}
                  className={styles.footerLogo}
                />
              </div>
              <p className={styles.footerDescription}>
                次世代のイベント管理システム
              </p>
            </div>
            
            <div className={styles.footerLinks}>
              <div className={styles.footerLinkGroup}>
                <h4 className={styles.footerLinkTitle}>サービス</h4>
                <Link href="/user/login" className={styles.footerLink}>Userログイン</Link>
                <Link href="/user/register" className={styles.footerLink}>User新規登録</Link>
                <Link href="/admin/login" className={styles.footerLink}>Adminログイン</Link>
                <Link href="/admin/register" className={styles.footerLink}>Admin新規登録</Link>
              </div>
              
              <div className={styles.footerLinkGroup}>
                <h4 className={styles.footerLinkTitle}>サポート</h4>
                <Link href="#" className={styles.footerLink}>ヘルプセンター</Link>
                <Link href="#" className={styles.footerLink}>お問い合わせ</Link>
                <Link href="#" className={styles.footerLink}>よくある質問</Link>
              </div>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p className={styles.footerCopy}>
              © 2026 VANTAN Event Management System
            </p>
            <p className={styles.footerNote}>
              本サービスはテスト運用中です
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}