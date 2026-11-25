import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './XPProgress.module.css';

interface XPProgressProps {
  currentLevel: number;
  nextLevel: number;
  nextLevelTitle: string;
  currentXP: number;
  requiredXP: number;
  remainingXP: number;
  progressPercent: number;
}

export const XPProgress: React.FC<XPProgressProps> = ({
  currentLevel,
  nextLevel,
  nextLevelTitle,
  currentXP,
  requiredXP,
  remainingXP,
  progressPercent,
}) => {
  const [mountedPercent, setMountedPercent] = useState(0);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setMountedPercent(progressPercent);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [progressPercent]);

  const currentLvlStr = String(currentLevel).padStart(2, '0');
  const nextLvlStr = String(nextLevel).padStart(2, '0');

  return (
    <article className={styles.card} aria-label="XP Progression Details">
      <div className={styles.topRow}>
        <div>
          <span className={styles.metricLabel}>Current XP</span>
          <p className={`${styles.xpBig} tabularNums`}>
            {currentXP.toLocaleString()} XP
          </p>
        </div>

        <div className={styles.neededBox}>
          <span className={styles.neededLabel}>XP Needed</span>
          <span className={`${styles.neededValue} tabularNums`}>
            {remainingXP > 0
              ? `${remainingXP.toLocaleString()} XP to Level ${nextLvlStr}`
              : `Ready for Level ${nextLvlStr}`}
          </span>
        </div>
      </div>

      <div className={styles.barSection}>
        <div className={styles.barLabels}>
          <span className="tabularNums">
            {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
          </span>
          <span className={`${styles.percentText} tabularNums`}>
            {progressPercent}%
          </span>
        </div>

        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Level ${currentLvlStr} progress: ${progressPercent}%`}
        >
          <div
            className={styles.fill}
            style={{ width: `${mountedPercent}%` }}
          />
        </div>
      </div>

      <div className={styles.transitionRow}>
        <div className={styles.levelStep}>
          <span>Level {currentLvlStr}</span>
          <ArrowRight size={15} className={styles.arrowIcon} aria-hidden="true" />
          <span>Next Level {nextLvlStr}</span>
        </div>
        <span className={styles.nextTitle}>{nextLevelTitle}</span>
      </div>
    </article>
  );
};
