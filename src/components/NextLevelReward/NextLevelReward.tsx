import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { RewardChestIllustration } from '../../assets/VeloopIllustrations';
import { RewardSpec } from '../../data/levelDashboardData';
import { LevelInfo } from '../LevelInfo/LevelInfo';
import styles from './NextLevelReward.module.css';

interface NextLevelRewardProps {
  nextLevel: number;
  reward: RewardSpec;
  progressPercent: number;
  remainingXP: number;
  isDemo: boolean;
}

export const NextLevelReward: React.FC<NextLevelRewardProps> = ({
  nextLevel,
  reward,
  progressPercent,
  remainingXP,
  isDemo,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const nxtStr = String(nextLevel).padStart(2, '0');
  const isUnlocked = remainingXP === 0;

  return (
    <article className={`vlCard ${styles.card}`} aria-label="Next-Level Reward Spotlight">
      <div className={styles.header}>
        <div className="d-flex align-items-center gap-2">
          <span className={styles.eyebrow}>Next-Level Reward</span>
          <span aria-hidden="true" style={{ color: 'var(--vl-text-muted)' }}>·</span>
          <span className={styles.lockText}>
            {isUnlocked ? <Unlock size={13} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}
            {isUnlocked ? 'Ready' : 'Locked'}
          </span>
        </div>

        <LevelInfo
          title="Reward Information"
          ariaLabel="About Next-Level Reward"
          description="The displayed reward is associated with the next level according to the current reward configuration."
          demoNote={isDemo ? 'Values shown are labeled development/demo figures.' : undefined}
        />
      </div>

      <div className={styles.spotlight}>
        <RewardChestIllustration size={80} />
        <div>
          <p className={`${styles.rewardAmount} tabularNums`}>+{reward.amount.toLocaleString()} {reward.type}</p>
          {reward.secondaryType && reward.secondaryAmount && (
            <p className={`${styles.secondaryReward} tabularNums`}>+{reward.secondaryAmount} {reward.secondaryType}</p>
          )}
          <p className="mb-0" style={{ fontSize: '0.82rem', color: 'var(--vl-text-secondary)' }}>
            {isUnlocked ? `Level ${nxtStr} reached — ready to claim` : `Reach Level ${nxtStr} to unlock`}
          </p>
        </div>
      </div>

      {showPreview && (
        <div className={styles.revealPanel}>
          Credits +{reward.amount.toLocaleString()} {reward.type}
          {reward.secondaryType && reward.secondaryAmount ? ` and +${reward.secondaryAmount} ${reward.secondaryType}` : ''} upon reaching Level {nxtStr}
          {isDemo ? ' (demo preview).' : '.'}
        </div>
      )}

      <div className={styles.footer}>
        <span className="tabularNums">{progressPercent}% unlocked{isDemo ? ' · Demo' : ''}</span>
        <button
          type="button"
          className="vlBtnGhost"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          onClick={() => setShowPreview((p) => !p)}
          aria-expanded={showPreview}
        >
          {showPreview ? 'Hide Details' : 'Preview Reward'}
        </button>
      </div>
    </article>
  );
};
