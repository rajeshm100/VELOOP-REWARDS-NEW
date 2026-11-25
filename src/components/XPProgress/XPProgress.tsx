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
    const raf = window.requestAnimationFrame(() => setMountedPercent(progressPercent));
    return () => window.cancelAnimationFrame(raf);
  }, [progressPercent]);

  const curStr = String(currentLevel).padStart(2, '0');
  const nxtStr = String(nextLevel).padStart(2, '0');

  return (
    <article className={`vlCard ${styles.card}`} aria-label="XP Progression Details">
      <div className={styles.topRow}>
        <div>
          <span className={styles.metricLabel}>Current XP</span>
          <p className={`${styles.xpBig} tabularNums`}>{currentXP.toLocaleString()} XP</p>
        </div>

        <div className={styles.neededBox}>
          <span className={styles.metricLabel}>XP Needed</span>
          <span className={`${styles.neededValue} tabularNums`}>
            {remainingXP > 0 ? `${remainingXP.toLocaleString()} XP to Level ${nxtStr}` : `Ready for Level ${nxtStr}`}
          </span>
        </div>
      </div>

      <div>
        <div className={styles.barLabels}>
          <span className="tabularNums">{currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP</span>
          <span className="tabularNums" style={{ fontWeight: 700, color: 'var(--vl-gold-bright)' }}>{progressPercent}%</span>
        </div>

        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Level ${curStr} progress: ${progressPercent}%`}
        >
          <div className={styles.fill} style={{ width: `${mountedPercent}%` }} />
        </div>
      </div>

      <div className={styles.transitionRow}>
        <div className="d-flex align-items-center gap-2 fw-semibold">
          <span>Level {curStr}</span>
          <ArrowRight size={15} color="var(--vl-gold)" aria-hidden="true" />
          <span>Next Level {nxtStr}</span>
        </div>
        <span style={{ color: 'var(--vl-text-muted)' }}>{nextLevelTitle}</span>
      </div>
    </article>
  );
};
