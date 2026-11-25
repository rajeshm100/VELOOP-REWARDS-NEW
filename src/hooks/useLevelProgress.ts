import { useMemo } from 'react';
import { LevelProgressionConfig } from '../data/levelDashboardData';

export function useLevelProgress(progression: LevelProgressionConfig) {
  return useMemo(() => {
    const required = Math.max(1, progression.requiredXP);
    const remainingXP = Math.max(0, required - progression.currentXP);
    const progressPercent = Math.min(100, Math.max(0, Math.round((progression.currentXP / required) * 100)));
    const nextLvl = String(progression.nextLevel).padStart(2, '0');

    let recommendationTip = `Earn ${remainingXP.toLocaleString()} XP across Play & Earn or Daily Tasks to unlock Level ${nextLvl}.`;
    if (remainingXP === 0) {
      recommendationTip = `Level ${nextLvl} threshold reached! Claim your unlocked tier rewards.`;
    } else if (remainingXP <= 50) {
      recommendationTip = `Only ${remainingXP} XP away from Level ${nextLvl}. One Reward Memory Match clear will level you up.`;
    } else if (remainingXP <= 400) {
      recommendationTip = `${remainingXP.toLocaleString()} XP away from Level ${nextLvl}. Combine Watch & Earn with a quick match.`;
    }

    return { remainingXP, progressPercent, recommendationTip };
  }, [progression]);
}
