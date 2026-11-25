import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { HexLevelBadge, RewardChestIllustration } from '../../assets/VeloopIllustrations';
import { RewardSpec, RoadmapLevelItem } from '../../data/levelDashboardData';
import styles from './LevelUpModal.module.css';

export const LevelUpModal: React.FC<{
  isOpen: boolean;
  newLevel: number;
  newLevelTitle: string;
  unlockedReward: RewardSpec;
  unlockedTier: RoadmapLevelItem | null;
  onContinue: () => void;
}> = ({ isOpen, newLevel, newLevelTitle, unlockedReward, unlockedTier, onContinue }) => {
  if (!isOpen) return null;

  const perks = unlockedTier?.perks ?? ['Higher daily XP limit', 'Access to new challenges'];

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="levelup-title">
      <div className={`vlCard ${styles.modal}`}>
        <p className="m-0 fw-bold" style={{ fontSize: '0.84rem', letterSpacing: '0.12em', color: 'var(--vl-gold)' }}>
          LEVEL UP
        </p>
        <h2 id="levelup-title" className="mt-1 mb-3 fw-bold" style={{ fontSize: '1.45rem' }}>
          You&apos;ve Reached Level {String(newLevel).padStart(2, '0')}
        </h2>

        <div className="d-flex justify-content-center mb-2">
          <HexLevelBadge level={newLevel} size={104} variant="current" withLaurel />
        </div>

        <p className="m-0 fw-semibold" style={{ color: 'var(--vl-gold-bright)' }}>
          {newLevelTitle} · Achievement Unlocked
        </p>

        <div className={styles.rewardRow}>
          <RewardChestIllustration size={52} />
          <div className="text-start">
            <span className="d-block fw-bold tabularNums" style={{ color: 'var(--vl-gold-bright)' }}>
              +{unlockedReward.amount} {unlockedReward.type}
              {unlockedReward.secondaryType && unlockedReward.secondaryAmount
                ? ` & +${unlockedReward.secondaryAmount} ${unlockedReward.secondaryType}`
                : ''}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--vl-text-secondary)' }}>
              Tier milestone reward unlocked (Demo)
            </span>
          </div>
        </div>

        <ul className={styles.perksList}>
          {perks.map((perk) => (
            <li key={perk} className="d-flex align-items-center gap-2">
              <CheckCircle2 size={15} color="var(--vl-subtle-green)" aria-hidden="true" />
              <span>{perk}</span>
            </li>
          ))}
        </ul>

        <button type="button" className="vlBtnGold w-100" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};
