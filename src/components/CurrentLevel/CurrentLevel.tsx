import React from 'react';
import { HexLevelBadge } from '../../assets/VeloopIllustrations';
import { LevelInfo } from '../LevelInfo/LevelInfo';
import styles from './CurrentLevel.module.css';

interface CurrentLevelProps {
  currentLevel: number;
  levelTitle: string;
  currentXP: number;
  progressPercent: number;
  isDemo: boolean;
}

export const CurrentLevel: React.FC<CurrentLevelProps> = ({
  currentLevel,
  levelTitle,
  currentXP,
  progressPercent,
  isDemo,
}) => (
  <article className={`vlCard ${styles.card}`} aria-label="Current Level Status">
    <div className={styles.header}>
      <div className="d-flex align-items-center gap-2">
        <span className={styles.eyebrow}>Current Level</span>
        <span aria-hidden="true" style={{ color: 'var(--vl-text-muted)' }}>·</span>
        <span className={styles.hereText}>You are here</span>
      </div>

      <LevelInfo
        title="Level Information"
        ariaLabel="About VELOOP Level System"
        description="XP helps you progress through VELOOP Rewards levels. As you reach new levels, you unlock additional rewards and experiences."
        demoNote={isDemo ? 'Displaying development/demo progression values.' : undefined}
      />
    </div>

    <div className={styles.body}>
      <HexLevelBadge level={currentLevel} size={92} variant="current" withLaurel />
      <div>
        <h2 className={styles.levelNumber}>Level {String(currentLevel).padStart(2, '0')}</h2>
        <p className={styles.levelName}>{levelTitle}</p>
        <p className={styles.metaLine}>
          <span className="tabularNums">{currentXP.toLocaleString()} XP</span> ·{' '}
          <span className="tabularNums">{progressPercent}%</span> tier progress
        </p>
      </div>
    </div>

    <div className={styles.footerNote}>
      <span>Tier Standing</span>
      <span>Active Milestone{isDemo ? ' · Demo' : ''}</span>
    </div>
  </article>
);
