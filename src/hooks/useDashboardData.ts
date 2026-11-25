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

export type DashboardPreviewMode =
  | 'normal'
  | 'loading'
  | 'empty'
  | 'error'
  | 'game_unavailable';

export function useDashboardData() {
  const [previewMode, setPreviewMode] = useState<DashboardPreviewMode>('normal');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [progression, setProgression] = useState<LevelProgressionConfig>(
    INITIAL_PROGRESSION_DATA
  );
  const [roadmapLevels, setRoadmapLevels] = useState<RoadmapLevelItem[]>(
    INITIAL_ROADMAP_LEVELS
  );
  const [activities, setActivities] = useState<XPActivityItem[]>(
    INITIAL_XP_ACTIVITY
  );

  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [lastUnlockedLevel, setLastUnlockedLevel] = useState<RoadmapLevelItem | null>(
    null
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsInitialLoading(false);
    }, 320);

    return () => window.clearTimeout(timer);
  }, []);

  const isLoading = isInitialLoading || previewMode === 'loading';
  const hasError = previewMode === 'error';
  const isEmptyActivity = previewMode === 'empty';
  const isGameUnavailable = previewMode === 'game_unavailable';

  const applyXPGain = useCallback(
    (
      xpGain: number,
      title: string,
      category: ActivityCategory,
      veGain = 0,
      options?: { deferLevelUpModal?: boolean }
    ) => {
      if (xpGain <= 0 && veGain <= 0) {
        return;
      }

      const newActivity: XPActivityItem = {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        category,
        xpAmount: xpGain,
        veAmount: veGain > 0 ? veGain : undefined,
        timestamp: 'Just now',
        isDemo: true,
      };

      setActivities((prev) => [newActivity, ...prev]);

      setProgression((prev) => {
        const updatedXP = prev.currentXP + xpGain;
        const leveledUp = updatedXP >= prev.requiredXP;

        if (leveledUp && !options?.deferLevelUpModal) {
          const nextTier =
            roadmapLevels.find((lvl) => lvl.level === prev.nextLevel) ?? null;
          setLastUnlockedLevel(nextTier);
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
    [roadmapLevels]
  );

  const checkPendingLevelUp = useCallback(() => {
    if (progression.currentXP >= progression.requiredXP) {
      const nextTier =
        roadmapLevels.find((lvl) => lvl.level === progression.nextLevel) ?? null;
      setLastUnlockedLevel(nextTier);
      setLevelUpModalOpen(true);
    }
  }, [progression, roadmapLevels]);

  const confirmLevelUpAdvance = useCallback(() => {
    setLevelUpModalOpen(false);

    setProgression((prev) => {
      if (prev.currentXP < prev.requiredXP) {
        return prev;
      }

      const promotedLevel = prev.nextLevel;
      const upcomingLevel = promotedLevel + 1;
      const nextRoadmapTier = roadmapLevels.find(
        (item) => item.level === upcomingLevel
      );
      const promotedTier = roadmapLevels.find(
        (item) => item.level === promotedLevel
      );

      setRoadmapLevels((currLevels) =>
        currLevels.map((lvl) => {
          if (lvl.level < promotedLevel) {
            return { ...lvl, status: 'completed' };
          }
          if (lvl.level === promotedLevel) {
            return { ...lvl, status: 'current' };
          }
          if (lvl.level === upcomingLevel) {
            return { ...lvl, status: 'next' };
          }
          return { ...lvl, status: 'locked' };
        })
      );

      return {
        ...prev,
        currentLevel: promotedLevel,
        levelTitle: promotedTier?.title ?? prev.nextLevelTitle,
        nextLevel: upcomingLevel,
        nextLevelTitle: nextRoadmapTier?.title ?? `Tier ${upcomingLevel}`,
        requiredXP: nextRoadmapTier?.requiredXP ?? prev.requiredXP + 3500,
        nextLevelReward: nextRoadmapTier?.reward ?? {
          type: 'VEs',
          amount: 850,
        },
      };
    });
  }, [roadmapLevels]);

  const triggerDemoLevelUp = useCallback(() => {
    const needed = Math.max(0, progression.requiredXP - progression.currentXP);
    const grant = needed > 0 ? needed : 0;

    if (grant > 0) {
      applyXPGain(grant, 'Demo Tier Milestone Grant', 'Challenges', 0);
    } else {
      const nextTier =
        roadmapLevels.find((lvl) => lvl.level === progression.nextLevel) ?? null;
      setLastUnlockedLevel(nextTier);
      setLevelUpModalOpen(true);
    }
  }, [progression, roadmapLevels, applyXPGain]);

  const retryLoad = useCallback(() => {
    setPreviewMode('loading');
    window.setTimeout(() => {
      setPreviewMode('normal');
    }, 360);
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
    activities: isEmptyActivity ? [] : activities,
    isLoading,
    hasError,
    isGameUnavailable,
    previewMode,
    setPreviewMode,
    levelUpModalOpen,
    setLevelUpModalOpen,
    lastUnlockedLevel,
    applyXPGain,
    checkPendingLevelUp,
    confirmLevelUpAdvance,
    triggerDemoLevelUp,
    retryLoad,
    resetDemoData,
  };
}
