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
  const [selectedCategory, setSelectedCategory] = useState<ActivityFilterOption>('All');

  const filteredActivities = useMemo(() => {
    if (selectedCategory === 'All') return activities;
    return activities.filter((item) => item.category === selectedCategory);
  }, [activities, selectedCategory]);

  return { selectedCategory, setSelectedCategory, filteredActivities };
}
