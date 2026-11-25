import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  HexLevelBadge,
  RewardChestIllustration,
} from '../../assets/VeloopIllustrations';
import { RewardSpec, RoadmapLevelItem } from '../../data/levelDashboardData';
import styles from './LevelUpModal.module.css';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  newLevelTitle: string;
  unlockedReward: RewardSpec;
  unlockedTier: RoadmapLevelItem | null;
  onContinue: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  newLevelTitle,
  unlockedReward,
  unlockedTier,
  onContinue,
}) => {
  if (!isOpen) {
    return null;
  }

  const formattedLevel = String(newLevel).padStart(2, '0');
  const perks = unlockedTier?.perks ?? [
    'Higher daily XP limit',
    'Access to new challenges',
    'Better reward opportunities',
  ];

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
    >
      <div className={styles.modal}>
        <p className={styles.eyebrow}>LEVEL UP</p>
        <h2 id="levelup-title" className={styles.title}>
          You&apos;ve Reached Level {formattedLevel}
        </h2>

        <div className={styles.badgeStage}>
          <HexLevelBadge level={newLevel} size={112} variant="current" withLaurel />
        </div>

        <p className={styles.tierName}>{newLevelTitle} · Achievement Unlocked</p>

        <div className={styles.rewardRow}>
          <RewardChestIllustration size={56} locked={false} />
          <div className={styles.rewardText}>
            <span className={`${styles.rewardPrimary} tabularNums`}>
              +{unlockedReward.amount} {unlockedReward.type}
              {unlockedReward.secondaryType && unlockedReward.secondaryAmount
                ? ` & +${unlockedReward.secondaryAmount} ${unlockedReward.secondaryType}`
                : ''}
            </span>
            <span className={styles.rewardSub}>
              Tier milestone reward unlocked (Demo)
            </span>
          </div>
        </div>

        <ul className={styles.perksList}>
          {perks.map((perk) => (
            <li key={perk} className={styles.perkItem}>
              <CheckCircle2 size={15} color="var(--vl-subtle-green)" aria-hidden="true" />
              <span>{perk}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.continueBtn}
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
