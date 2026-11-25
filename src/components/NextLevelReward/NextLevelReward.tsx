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
  const nextLvlStr = String(nextLevel).padStart(2, '0');
  const isUnlocked = remainingXP === 0;

  return (
    <article className={styles.card} aria-label="Next-Level Reward Spotlight">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.eyebrow}>Next-Level Reward</span>
          <span aria-hidden="true" style={{ color: 'var(--vl-text-muted)' }}>·</span>
          <span className={styles.lockText}>
            {isUnlocked ? (
              <>
                <Unlock size={13} aria-hidden="true" /> Ready
              </>
            ) : (
              <>
                <Lock size={13} aria-hidden="true" /> Locked
              </>
            )}
          </span>
        </div>

        <LevelInfo
          title="Reward Information"
          ariaLabel="About Next-Level Reward"
          description="The displayed reward is associated with the next level according to the current reward configuration."
          demoNote={isDemo ? 'Reward values shown are labeled development/demo figures.' : undefined}
        />
      </div>

      <div className={styles.spotlight}>
        <div className={`${styles.chestBox} ${showPreview ? styles.chestBoxRevealed : ''}`}>
          <RewardChestIllustration size={84} locked={!isUnlocked} />
        </div>

        <div>
          <p className={`${styles.rewardAmount} tabularNums`}>
            +{reward.amount.toLocaleString()} {reward.type}
          </p>
          {reward.secondaryType && reward.secondaryAmount && (
            <p className={`${styles.secondaryReward} tabularNums`}>
              +{reward.secondaryAmount} {reward.secondaryType}
            </p>
          )}
          <p className={styles.unlockPrompt}>
            {isUnlocked
              ? `Level ${nextLvlStr} reached — reward ready to claim`
              : `Reach Level ${nextLvlStr} to unlock`}
          </p>
        </div>
      </div>

      {showPreview && (
        <div className={styles.revealPanel}>
          Includes +{reward.amount.toLocaleString()} {reward.type}
          {reward.secondaryType && reward.secondaryAmount
            ? ` and +${reward.secondaryAmount} ${reward.secondaryType}`
            : ''}{' '}
          credited to your VELOOP wallet upon reaching Level {nextLvlStr}
          {isDemo ? ' (demo preview).' : '.'}
        </div>
      )}

      <div className={styles.footer}>
        <span className={`${styles.progressMini} tabularNums`}>
          {progressPercent}% unlocked{isDemo ? ' · Demo' : ''}
        </span>
        <button
          type="button"
          className={styles.previewBtn}
          onClick={() => setShowPreview((prev) => !prev)}
          aria-expanded={showPreview}
        >
          {showPreview ? 'Hide Details' : 'Preview Reward'}
        </button>
      </div>
    </article>
  );
};
