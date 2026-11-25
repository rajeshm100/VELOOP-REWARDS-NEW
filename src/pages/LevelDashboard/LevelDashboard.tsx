import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, ChevronRight, Menu, RefreshCw, X } from 'lucide-react';
import { CurrentLevel } from '../../components/CurrentLevel/CurrentLevel';
import { EarnMoreXP } from '../../components/EarnMoreXP/EarnMoreXP';
import { LevelHero } from '../../components/LevelHero/LevelHero';
import { LevelRoadmap } from '../../components/LevelRoadmap/LevelRoadmap';
import { LevelUpModal } from '../../components/LevelUpModal/LevelUpModal';
import { NextLevelReward } from '../../components/NextLevelReward/NextLevelReward';
import { GameContainer } from '../../components/PlayAndEarn/GameContainer/GameContainer';
import { XPActivity } from '../../components/XPActivity/XPActivity';
import { XPProgress } from '../../components/XPProgress/XPProgress';
import {
  DashboardPreviewMode,
  useDashboardData,
} from '../../hooks/useDashboardData';
import { useLevelProgress } from '../../hooks/useLevelProgress';
import styles from './LevelDashboard.module.css';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'play-and-earn', label: 'Play & Earn' },
  { id: 'earn-more', label: 'Earn XP' },
  { id: 'activity', label: 'Activity' },
];

const PREVIEW_OPTIONS: { id: DashboardPreviewMode; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'loading', label: 'Loading' },
  { id: 'empty', label: 'Empty Activity' },
  { id: 'game_unavailable', label: 'Game Offline' },
  { id: 'error', label: 'Error' },
];

export const LevelDashboard: React.FC = () => {
  const {
    progression,
    roadmapLevels,
    earningOpportunities,
    activities,
    isLoading,
    hasError,
    isGameUnavailable,
    previewMode,
    setPreviewMode,
    levelUpModalOpen,
    lastUnlockedLevel,
    applyXPGain,
    checkPendingLevelUp,
    confirmLevelUpAdvance,
    triggerDemoLevelUp,
    retryLoad,
    resetDemoData,
  } = useDashboardData();

  const { remainingXP, progressPercent, recommendationTip } =
    useLevelProgress(progression);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const scrollToSection = useCallback((sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (!el) {
      return;
    }

    const headerHeight = headerRef.current?.offsetHeight ?? 60;
    const extraBreathingSpace = 20;
    const targetTop =
      el.getBoundingClientRect().top + window.scrollY - headerHeight - extraBreathingSpace;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  }, []);

  const handleNavLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      event.preventDefault();
      scrollToSection(sectionId);
    },
    [scrollToSection]
  );

  const handleGameReward = useCallback(
    (xp: number, title: string, veEarned: number) => {
      applyXPGain(xp, title, 'Games', veEarned, { deferLevelUpModal: true });
    },
    [applyXPGain]
  );

  const handleBackFromGame = useCallback(() => {
    scrollToSection('overview');
    checkPendingLevelUp();
  }, [scrollToSection, checkPendingLevelUp]);

  return (
    <div className={styles.pageShell}>
      <header ref={headerRef} className={styles.topBar}>
        <div className={`container-xxl ${styles.topBarInner}`}>
          <a
            href="#overview"
            className={styles.brandMark}
            onClick={(e) => handleNavLinkClick(e, 'overview')}
          >
            VELOOP Rewards
          </a>

          <nav className={styles.navLinks} aria-label="Dashboard sections">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={styles.navLink}
                onClick={(e) => handleNavLinkClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.topBarActions}>
            <button
              type="button"
              className={styles.topCta}
              onClick={() => scrollToSection('play-and-earn')}
            >
              Play &amp; Earn
            </button>

            <button
              type="button"
              className={styles.hamburgerBtn}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div
            className={styles.mobileBackdrop}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-nav-drawer"
            className={styles.mobileDrawer}
            aria-label="Mobile navigation"
          >
            <ul className={styles.mobileNavList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={styles.mobileNavLink}
                    onClick={(e) => handleNavLinkClick(e, item.id)}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={16} color="var(--vl-text-muted)" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={styles.mobileDrawerCta}
              onClick={() => scrollToSection('play-and-earn')}
            >
              Play Memory Match
            </button>
          </nav>
        </>
      )}

      <main id="overview" className={`container-xxl ${styles.mainContent}`}>
        {hasError ? (
          <div className={styles.errorBox} role="alert">
            <AlertTriangle size={36} color="var(--vl-error)" aria-hidden="true" />
            <h1 className={styles.errorTitle}>Unable to Load Level Progress</h1>
            <p className={styles.errorMsg}>
              We couldn&apos;t load your level information right now. Please check your connection and try again.
            </p>
            <button
              type="button"
              className={styles.retryBtn}
              onClick={retryLoad}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.stackSection} aria-busy="true" aria-label="Loading Level Dashboard">
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonBar} style={{ width: '38%', height: 26, marginBottom: 14 }} />
              <div className={styles.skeletonBar} style={{ width: '65%', height: 16, marginBottom: 10 }} />
              <div className={styles.skeletonBar} style={{ width: '50%', height: 16 }} />
            </div>

            <div className="row g-4">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="col-12 col-md-6 col-xl-4">
                  <div className={styles.skeletonCard}>
                    <div className={styles.skeletonBar} style={{ width: '42%', height: 16, marginBottom: 18 }} />
                    <div className={styles.skeletonBar} style={{ width: '75%', height: 34, marginBottom: 14 }} />
                    <div className={styles.skeletonBar} style={{ width: '100%', height: 12 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.skeletonCard}>
              <div className={styles.skeletonBar} style={{ width: '30%', height: 22, marginBottom: 16 }} />
              <div className={styles.skeletonBar} style={{ width: '100%', height: 120 }} />
            </div>

            <div className="row g-4">
              <div className="col-12 col-lg-7">
                <div className={styles.skeletonCard}>
                  <div className={styles.skeletonBar} style={{ width: '40%', height: 22, marginBottom: 16 }} />
                  <div className={styles.skeletonBar} style={{ width: '100%', height: 240 }} />
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className={styles.skeletonCard}>
                  <div className={styles.skeletonBar} style={{ width: '40%', height: 22, marginBottom: 16 }} />
                  <div className={styles.skeletonBar} style={{ width: '100%', height: 240 }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.stackSection}>
            <LevelHero
              progression={progression}
              recommendationTip={recommendationTip}
              onJumpToGame={() => scrollToSection('play-and-earn')}
              onJumpToEarn={() => scrollToSection('earn-more')}
            />

            <div className="row g-4 align-items-stretch">
              <div className="col-12 col-md-6 col-xl-4">
                <CurrentLevel
                  currentLevel={progression.currentLevel}
                  levelTitle={progression.levelTitle}
                  currentXP={progression.currentXP}
                  progressPercent={progressPercent}
                  isDemo={progression.isDemo}
                />
              </div>

              <div className="col-12 col-md-6 col-xl-4">
                <XPProgress
                  currentLevel={progression.currentLevel}
                  nextLevel={progression.nextLevel}
                  nextLevelTitle={progression.nextLevelTitle}
                  currentXP={progression.currentXP}
                  requiredXP={progression.requiredXP}
                  remainingXP={remainingXP}
                  progressPercent={progressPercent}
                />
              </div>

              <div className="col-12 col-md-12 col-xl-4">
                <NextLevelReward
                  nextLevel={progression.nextLevel}
                  reward={progression.nextLevelReward}
                  progressPercent={progressPercent}
                  remainingXP={remainingXP}
                  isDemo={progression.isDemo}
                />
              </div>
            </div>

            <LevelRoadmap
              levels={roadmapLevels}
              currentLevel={progression.currentLevel}
            />

            <div className="row g-4 align-items-stretch">
              <div className="col-12 col-xl-7">
                <GameContainer
                  isUnavailable={isGameUnavailable}
                  onAwardXP={handleGameReward}
                  onBackToOverview={handleBackFromGame}
                />
              </div>

              <div className="col-12 col-xl-5">
                <XPActivity
                  activities={activities}
                  xpEarnedToday={progression.todayStats.xpEarnedToday}
                  vesEarnedToday={progression.todayStats.vesEarnedToday}
                  onStartEarning={() => scrollToSection('earn-more')}
                />
              </div>
            </div>

            <EarnMoreXP
              opportunities={earningOpportunities}
              remainingXP={remainingXP}
              nextLevel={progression.nextLevel}
              onJumpToGame={() => scrollToSection('play-and-earn')}
              onClaimDemoPathwayXP={applyXPGain}
            />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={`container-xxl ${styles.footerInner}`}>
          <span className={styles.footerNote}>
            VELOOP Rewards · Route /Lvl-Dashboard · All values shown are development/demo data
          </span>

          <div className={styles.stateBar} aria-label="Demo UX state preview controls">
            <span className={styles.stateLabel}>View State:</span>
            {PREVIEW_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`${styles.stateBtn} ${
                  previewMode === opt.id ? styles.stateBtnActive : ''
                }`}
                onClick={() => setPreviewMode(opt.id)}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              className={styles.stateBtn}
              onClick={triggerDemoLevelUp}
            >
              Test Level-Up
            </button>
            <button
              type="button"
              className={styles.stateBtn}
              onClick={resetDemoData}
            >
              Reset Demo
            </button>
          </div>
        </div>
      </footer>

      <LevelUpModal
        isOpen={levelUpModalOpen}
        newLevel={progression.nextLevel}
        newLevelTitle={progression.nextLevelTitle}
        unlockedReward={progression.nextLevelReward}
        unlockedTier={lastUnlockedLevel}
        onContinue={confirmLevelUpAdvance}
      />
    </div>
  );
};
