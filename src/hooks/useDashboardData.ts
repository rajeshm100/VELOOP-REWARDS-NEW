import { useCallback, useEffect, useState } from 'react';
import {
  ActivityCategory,
  EARNING_OPPORTUNITIES,
  INITIAL_PROGRESSION_DATA,
  INITIAL_ROADMAP_LEVELS,
  INITIAL_XP_ACTIVITY,
  LevelProgressionConfig,
  RoadmapLevelItem,
  XPActivityItem,
} from '../data/levelDashboardData';

export type DashboardPreviewMode = 'normal' | 'loading' | 'empty' | 'error' | 'game_unavailable';

export function useDashboardData() {
  const [previewMode, setPreviewMode] = useState<DashboardPreviewMode>('normal');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [progression, setProgression] = useState<LevelProgressionConfig>(INITIAL_PROGRESSION_DATA);
  const [roadmapLevels, setRoadmapLevels] = useState<RoadmapLevelItem[]>(INITIAL_ROADMAP_LEVELS);
  const [activities, setActivities] = useState<XPActivityItem[]>(INITIAL_XP_ACTIVITY);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsInitialLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  const applyXPGain = useCallback(
    (xpGain: number, title: string, category: ActivityCategory, veGain = 0, deferModal = false) => {
      if (xpGain <= 0 && veGain <= 0) return;

      setActivities((prev) => [
        {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title,
          category,
          xpAmount: xpGain,
          veAmount: veGain > 0 ? veGain : undefined,
          timestamp: 'Just now',
          isDemo: true,
        },
        ...prev,
      ]);

      setProgression((prev) => {
        const updatedXP = prev.currentXP + xpGain;
        if (updatedXP >= prev.requiredXP && !deferModal) {
          setLevelUpModalOpen(true);
        }
        return {
          ...prev,
          currentXP: updatedXP,
          todayStats: {
            ...prev.todayStats,
            xpEarnedToday: prev.todayStats.xpEarnedToday + xpGain,
            vesEarnedToday: prev.todayStats.vesEarnedToday + veGain,
          },
        };
      });
    },
    []
  );

  const checkPendingLevelUp = useCallback(() => {
    if (progression.currentXP >= progression.requiredXP) {
      setLevelUpModalOpen(true);
    }
  }, [progression.currentXP, progression.requiredXP]);

  const confirmLevelUpAdvance = useCallback(() => {
    setLevelUpModalOpen(false);
    setProgression((prev) => {
      if (prev.currentXP < prev.requiredXP) return prev;
      const promoted = prev.nextLevel;
      const upcoming = promoted + 1;
      const promotedTier = roadmapLevels.find((l) => l.level === promoted);
      const nextTier = roadmapLevels.find((l) => l.level === upcoming);

      setRoadmapLevels((curr) =>
        curr.map((l) => ({
          ...l,
          status: l.level < promoted ? 'completed' : l.level === promoted ? 'current' : l.level === upcoming ? 'next' : 'locked',
        }))
      );

      return {
        ...prev,
        currentLevel: promoted,
        levelTitle: promotedTier?.title ?? prev.nextLevelTitle,
        nextLevel: upcoming,
        nextLevelTitle: nextTier?.title ?? `Tier ${upcoming}`,
        requiredXP: nextTier?.requiredXP ?? prev.requiredXP + 3500,
        nextLevelReward: nextTier?.reward ?? { type: 'VEs', amount: 850 },
      };
    });
  }, [roadmapLevels]);

  const triggerDemoLevelUp = useCallback(() => {
    const needed = Math.max(0, progression.requiredXP - progression.currentXP);
    if (needed > 0) {
      applyXPGain(needed, 'Demo Tier Milestone Grant', 'Challenges');
    } else {
      setLevelUpModalOpen(true);
    }
  }, [progression.requiredXP, progression.currentXP, applyXPGain]);

  const retryLoad = useCallback(() => {
    setPreviewMode('loading');
    window.setTimeout(() => setPreviewMode('normal'), 320);
  }, []);

  const resetDemoData = useCallback(() => {
    setProgression(INITIAL_PROGRESSION_DATA);
    setRoadmapLevels(INITIAL_ROADMAP_LEVELS);
    setActivities(INITIAL_XP_ACTIVITY);
    setLevelUpModalOpen(false);
    setPreviewMode('normal');
  }, []);

  return {
    progression,
    roadmapLevels,
    earningOpportunities: EARNING_OPPORTUNITIES,
    activities: previewMode === 'empty' ? [] : activities,
    lastUnlockedLevel: roadmapLevels.find((l) => l.level === progression.nextLevel) ?? null,
    isLoading: isInitialLoading || previewMode === 'loading',
    hasError: previewMode === 'error',
    isGameUnavailable: previewMode === 'game_unavailable',
    previewMode,
    setPreviewMode,
    levelUpModalOpen,
    applyXPGain,
    checkPendingLevelUp,
    confirmLevelUpAdvance,
    triggerDemoLevelUp,
    retryLoad,
    resetDemoData,
  };
}
