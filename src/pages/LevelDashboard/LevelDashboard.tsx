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
import { DashboardPreviewMode, useDashboardData } from '../../hooks/useDashboardData';
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
    lastUnlockedLevel,
    isLoading,
    hasError,
    isGameUnavailable,
    previewMode,
    setPreviewMode,
    levelUpModalOpen,
    applyXPGain,
    checkPendingLevelUp,
    confirmLevelUpAdvance,
    triggerDemoLevelUp,
    retryLoad,
    resetDemoData,
  } = useDashboardData();

  const { remainingXP, progressPercent, recommendationTip } = useLevelProgress(progression);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    const onResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileMenuOpen]);

  const scrollToSection = useCallback((sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (!el) return;
    const offset = (headerRef.current?.offsetHeight ?? 60) + 20;
    window.scrollTo({
      top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset),
      behavior: 'smooth',
    });
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      scrollToSection(sectionId);
    },
    [scrollToSection]
  );

  return (
    <div className={styles.pageShell}>
      <header ref={headerRef} className={styles.topBar}>
        <div className={`container-xxl ${styles.topBarInner}`}>
          <a href="#overview" className={styles.brandMark} onClick={(e) => handleNavClick(e, 'overview')}>
            VELOOP Rewards
          </a>

          <nav className={styles.navLinks} aria-label="Dashboard sections">
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={styles.navLink} onClick={(e) => handleNavClick(e, item.id)}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <button type="button" className={`vlBtnGold ${styles.topCta}`} onClick={() => scrollToSection('play-and-earn')}>
              Play &amp; Earn
            </button>
            <button
              type="button"
              className={styles.hamburgerBtn}
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div className={styles.mobileBackdrop} onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <nav id="mobile-nav-drawer" className={styles.mobileDrawer} aria-label="Mobile navigation">
            <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, item.id)}>
                    <span>{item.label}</span>
                    <ChevronRight size={16} color="var(--vl-text-muted)" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <button type="button" className="vlBtnGold w-100 mt-3" onClick={() => scrollToSection('play-and-earn')}>
              Play Memory Match
            </button>
          </nav>
        </>
      )}

      <main id="overview" className={`container-xxl ${styles.mainContent}`}>
        {hasError ? (
          <div className={`vlCard ${styles.errorBox}`} role="alert">
            <AlertTriangle size={34} color="var(--vl-error)" aria-hidden="true" />
            <h1 className="m-0 fw-bold" style={{ fontSize: '1.3rem' }}>Unable to Load Level Progress</h1>
            <p className="m-0" style={{ fontSize: '0.9rem', color: 'var(--vl-text-secondary)' }}>
              We couldn&apos;t load your level information right now. Please try again.
            </p>
            <button type="button" className="vlBtnGold mt-2" onClick={retryLoad}>
              <RefreshCw size={16} aria-hidden="true" />
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="d-flex flex-column gap-4" aria-busy="true" aria-label="Loading Level Dashboard">
            <div className="vlCard"><div className={styles.skeletonBar} style={{ width: '55%', height: 74 }} /></div>
            <div className="row g-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="col-12 col-md-6 col-xl-4">
                  <div className="vlCard"><div className={styles.skeletonBar} style={{ width: '100%', height: 96 }} /></div>
                </div>
              ))}
            </div>
            <div className="vlCard"><div className={styles.skeletonBar} style={{ width: '100%', height: 140 }} /></div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
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

            <LevelRoadmap levels={roadmapLevels} currentLevel={progression.currentLevel} />

            <div className="row g-4 align-items-stretch">
              <div className="col-12 col-xl-7">
                <GameContainer
                  isUnavailable={isGameUnavailable}
                  onAwardXP={(xp, title, ve) => applyXPGain(xp, title, 'Games', ve, true)}
                  onBackToOverview={() => {
                    scrollToSection('overview');
                    checkPendingLevelUp();
                  }}
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
        <div className="container-xxl d-flex flex-wrap align-items-center justify-content-between gap-3">
          <span style={{ fontSize: '0.8rem', color: 'var(--vl-text-muted)' }}>
            VELOOP Rewards · /Lvl-Dashboard · Development/demo data
          </span>
          <div className="d-flex flex-wrap align-items-center gap-2" aria-label="Demo UX state preview controls">
            {PREVIEW_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`${styles.stateBtn} ${previewMode === opt.id ? styles.stateBtnActive : ''}`}
                onClick={() => setPreviewMode(opt.id)}
              >
                {opt.label}
              </button>
            ))}
            <button type="button" className={styles.stateBtn} onClick={triggerDemoLevelUp}>Test Level-Up</button>
            <button type="button" className={styles.stateBtn} onClick={resetDemoData}>Reset Demo</button>
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
