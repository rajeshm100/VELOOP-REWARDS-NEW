import { useMemo, useState } from 'react';
import { ActivityCategory, XPActivityItem } from '../data/levelDashboardData';

export type ActivityFilterOption = 'All' | ActivityCategory;

export const ACTIVITY_FILTER_OPTIONS: ActivityFilterOption[] = [
  'All',
  'Tasks',
  'Referrals',
  'Games',
  'Streaks',
  'Daily Bonuses',
  'Challenges',
];

export function useActivityFilter(activities: XPActivityItem[]) {
  const [selectedCategory, setSelectedCategory] =
    useState<ActivityFilterOption>('All');

  const filteredActivities = useMemo(() => {
    if (selectedCategory === 'All') {
      return activities;
    }

    return activities.filter((item) => item.category === selectedCategory);
  }, [activities, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<ActivityFilterOption, number> = {
      All: activities.length,
      Tasks: 0,
      Referrals: 0,
      Games: 0,
      Streaks: 0,
      'Daily Bonuses': 0,
      Challenges: 0,
    };

    activities.forEach((item) => {
      counts[item.category] += 1;
    });

    return counts;
  }, [activities]);

  return {
    selectedCategory,
    setSelectedCategory,
    filteredActivities,
    categoryCounts,
  };
}
