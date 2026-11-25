import React from 'react';
import { Check, Compass, Lock, Target } from 'lucide-react';
import { HexLevelBadge } from '../../assets/VeloopIllustrations';
import { RoadmapLevelItem } from '../../data/levelDashboardData';
import styles from './LevelRewardCard.module.css';

interface LevelRewardCardProps {
  item: RoadmapLevelItem;
  isSelected: boolean;
  onSelect: (level: number) => void;
}

export const LevelRewardCard: React.FC<LevelRewardCardProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  const statusConfig = {
    completed: {
      label: 'Completed',
      icon: <Check size={13} aria-hidden="true" />,
      cardClass: styles.completed,
      statusClass: styles.statusCompleted,
    },
    current: {
      label: 'You Are Here',
      icon: <Compass size={13} aria-hidden="true" />,
      cardClass: styles.current,
      statusClass: styles.statusCurrent,
    },
    next: {
      label: 'Next Goal',
      icon: <Target size={13} aria-hidden="true" />,
      cardClass: styles.next,
      statusClass: styles.statusNext,
    },
    locked: {
      label: 'Locked',
      icon: <Lock size={13} aria-hidden="true" />,
      cardClass: styles.locked,
      statusClass: styles.statusLocked,
    },
  }[item.status];

  const rewardSummary = item.reward.secondaryType
    ? `+${item.reward.amount} ${item.reward.type} · +${item.reward.secondaryAmount} ${item.reward.secondaryType}`
    : `+${item.reward.amount} ${item.reward.type}`;

  return (
    <button
      type="button"
      className={`${styles.card} ${statusConfig.cardClass} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(item.level)}
      aria-pressed={isSelected}
      aria-label={`Level ${item.level} ${item.title}, ${statusConfig.label}, reward ${rewardSummary}`}
    >
      <span className={`${styles.statusLine} ${statusConfig.statusClass}`}>
        {statusConfig.icon}
        <span>{statusConfig.label}</span>
      </span>

      <HexLevelBadge level={item.level} size={62} variant={item.status} />

      <p className={styles.levelTitle}>{item.title}</p>

      <span className={`${styles.xpReq} tabularNums`}>
        {item.requiredXP.toLocaleString()} XP
      </span>

      <span className={`${styles.rewardLine} tabularNums`}>
        {rewardSummary}
      </span>
    </button>
  );
};
