import React from 'react';
import { Check, Compass, Lock, Target } from 'lucide-react';
import { HexLevelBadge } from '../../assets/VeloopIllustrations';
import { RoadmapLevelItem } from '../../data/levelDashboardData';
import styles from './LevelRewardCard.module.css';

const STATUS_META = {
  completed: { label: 'Completed', color: 'var(--vl-subtle-green)', Icon: Check },
  current: { label: 'You Are Here', color: 'var(--vl-gold-bright)', Icon: Compass },
  next: { label: 'Next Goal', color: 'var(--vl-soft-blue)', Icon: Target },
  locked: { label: 'Locked', color: 'var(--vl-text-muted)', Icon: Lock },
};

export const LevelRewardCard: React.FC<{
  item: RoadmapLevelItem;
  isSelected: boolean;
  onSelect: (level: number) => void;
}> = ({ item, isSelected, onSelect }) => {
  const { label, color, Icon } = STATUS_META[item.status];
  const rewardSummary = item.reward.secondaryType
    ? `+${item.reward.amount} ${item.reward.type} · +${item.reward.secondaryAmount} ${item.reward.secondaryType}`
    : `+${item.reward.amount} ${item.reward.type}`;

  return (
    <button
      type="button"
      className={`${styles.card} ${styles[item.status]} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(item.level)}
      aria-pressed={isSelected}
      aria-label={`Level ${item.level} ${item.title}, ${label}, reward ${rewardSummary}`}
    >
      <span className={styles.statusLine} style={{ color }}>
        <Icon size={13} aria-hidden="true" />
        <span>{label}</span>
      </span>
      <HexLevelBadge level={item.level} size={60} variant={item.status} />
      <p className={styles.levelTitle}>{item.title}</p>
      <span className={`${styles.xpReq} tabularNums`}>{item.requiredXP.toLocaleString()} XP</span>
      <span className={`${styles.rewardLine} tabularNums`}>{rewardSummary}</span>
    </button>
  );
};
