import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { LevelProgressionConfig } from '../../data/levelDashboardData';
import styles from './LevelHero.module.css';

interface LevelHeroProps {
  progression: LevelProgressionConfig;
  recommendationTip: string;
  onJumpToGame: () => void;
  onJumpToEarn: () => void;
}

export const LevelHero: React.FC<LevelHeroProps> = ({
  progression,
  recommendationTip,
  onJumpToGame,
  onJumpToEarn,
}) => {
  const { userName, todayStats, isDemo } = progression;

  return (
    <section className={`vlCard ${styles.hero}`} aria-labelledby="hero-heading">
      <div className={styles.heroGrid}>
        <div>
          <div className={styles.kickerRow}>
            <span>Good Morning, {userName}</span>
            <span aria-hidden="true">·</span>
            <span>VELOOP Rewards</span>
            {isDemo && (
              <>
                <span aria-hidden="true">·</span>
                <span style={{ color: 'var(--vl-text-muted)' }}>Demo Data</span>
              </>
            )}
          </div>

          <h1 id="hero-heading" className={styles.headline}>
            Level Up Your Rewards
          </h1>

          <p className={styles.subtext}>
            Track your XP progression, preview next-level rewards, and build momentum through skill-based games and verified earning pathways.
          </p>

          <div className={styles.recommendation}>
            <Compass size={18} color="var(--vl-soft-blue)" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <div>
              <span className={styles.recTitle}>Recommended for You</span>
              <p className={styles.recText}>{recommendationTip}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className={styles.boostTitle}>Today&apos;s Boost Summary</h2>

          <div className={styles.boostGrid}>
            <div className={styles.boostItem}>
              <span className={styles.boostLabel}>XP Earned</span>
              <span className={`${styles.boostValue} tabularNums`} style={{ color: 'var(--vl-gold-bright)' }}>
                +{todayStats.xpEarnedToday} XP
              </span>
            </div>

            <div className={styles.boostItem}>
              <span className={styles.boostLabel}>Tasks Done</span>
              <span className={`${styles.boostValue} tabularNums`} style={{ color: 'var(--vl-subtle-green)' }}>
                {todayStats.tasksCompleted} / {todayStats.tasksTotal}
              </span>
            </div>

            <div className={styles.boostItem}>
              <span className={styles.boostLabel}>Active Streak</span>
              <span className={`${styles.boostValue} tabularNums`}>
                {todayStats.streakDays} Days
              </span>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="vlBtnGold" onClick={onJumpToGame}>
              Play Memory Match
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button type="button" className="vlBtnGhost" onClick={onJumpToEarn}>
              Ways to Earn XP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
