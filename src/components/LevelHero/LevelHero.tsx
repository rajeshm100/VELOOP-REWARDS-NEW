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
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroGrid}>
        <div>
          <div className={styles.kickerRow}>
            <span>Good Morning, {userName}</span>
            <span className={styles.separator} aria-hidden="true">·</span>
            <span>VELOOP Rewards Progression</span>
            {isDemo && (
              <>
                <span className={styles.separator} aria-hidden="true">·</span>
                <span className={styles.demoLabel}>Demo Data</span>
              </>
            )}
          </div>

          <h1 id="hero-heading" className={styles.headline}>
            Level Up Your Rewards
          </h1>

          <p className={styles.subtext}>
            Track your XP velocity, preview your next tier unlock, and build momentum
            through skill-based mini-games and verified earning activities.
          </p>

          <div className={styles.recommendation}>
            <Compass size={18} className={styles.recIcon} aria-hidden="true" />
            <div>
              <span className={styles.recTitle}>Recommended for You</span>
              <p className={styles.recText}>{recommendationTip}</p>
            </div>
          </div>
        </div>

        <div className={styles.statsCol}>
          <div className={styles.boostHeader}>
            <h2 className={styles.boostTitle}>Today&apos;s Boost Summary</h2>
            <span className={styles.demoLabel}>Session Overview</span>
          </div>

          <div className={styles.boostGrid}>
            <div className={styles.boostItem}>
              <span className={styles.boostLabel}>XP Earned</span>
              <span className={`${styles.boostValue} ${styles.boostGold} tabularNums`}>
                +{todayStats.xpEarnedToday} XP
              </span>
            </div>

            <div className={styles.boostItem}>
              <span className={styles.boostLabel}>Tasks Done</span>
              <span className={`${styles.boostValue} ${styles.boostGreen} tabularNums`}>
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

          <div className={styles.quickActions}>
            <button
              type="button"
              className={styles.primaryCta}
              onClick={onJumpToGame}
            >
              Play Memory Match
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.secondaryCta}
              onClick={onJumpToEarn}
            >
              Ways to Earn XP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
