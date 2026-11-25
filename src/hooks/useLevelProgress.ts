import { useMemo } from 'react';
import { LevelProgressionConfig } from '../data/levelDashboardData';

export interface DerivedLevelProgress {
  remainingXP: number;
  progressPercent: number;
  hasReachedNextLevel: boolean;
  recommendationTip: string;
}

export function useLevelProgress(
  progression: LevelProgressionConfig
): DerivedLevelProgress {
  return useMemo(() => {
    const safeRequired = Math.max(1, progression.requiredXP);
    const remainingXP = Math.max(0, safeRequired - progression.currentXP);
    const rawPercent = (progression.currentXP / safeRequired) * 100;
    const progressPercent = Math.min(100, Math.max(0, Math.round(rawPercent)));
    const hasReachedNextLevel = progression.currentXP >= safeRequired;

    let recommendationTip = `Earn ${remainingXP.toLocaleString()} XP across Play & Earn, Watch & Earn, or Daily Tasks to unlock Level ${String(progression.nextLevel).padStart(2, '0')}.`;

    if (hasReachedNextLevel) {
      recommendationTip = `Level ${String(progression.nextLevel).padStart(2, '0')} threshold reached! Claim your unlocked tier rewards.`;
    } else if (remainingXP <= 50) {
      recommendationTip = `You are only ${remainingXP} XP away from Level ${String(progression.nextLevel).padStart(2, '0')}. One Reward Memory Match clear or Daily Task will level you up.`;
    } else if (remainingXP <= 400) {
      recommendationTip = `You are ${remainingXP.toLocaleString()} XP away from Level ${String(progression.nextLevel).padStart(2, '0')}. Complete Watch & Earn and a quick match to close the gap.`;
    }

    return {
      remainingXP,
      progressPercent,
      hasReachedNextLevel,
      recommendationTip,
    };
  }, [progression]);
}
