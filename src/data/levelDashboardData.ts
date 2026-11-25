export type RewardType = 'VEs' | 'Gems' | 'XP';

export interface RewardSpec {
  type: RewardType;
  amount: number;
  secondaryType?: RewardType;
  secondaryAmount?: number;
}

export interface LevelProgressionConfig {
  userName: string;
  currentLevel: number;
  levelTitle: string;
  currentXP: number;
  nextLevel: number;
  nextLevelTitle: string;
  requiredXP: number;
  nextLevelReward: RewardSpec;
  todayStats: {
    xpEarnedToday: number;
    tasksCompleted: number;
    tasksTotal: number;
    streakDays: number;
    vesEarnedToday: number;
  };
  isDemo: boolean;
}

export type RoadmapStatus = 'completed' | 'current' | 'next' | 'locked';

export interface RoadmapLevelItem {
  level: number;
  title: string;
  requiredXP: number;
  reward: RewardSpec;
  perks: string[];
  status: RoadmapStatus;
  isDemo: boolean;
}

export type MemorySymbolId =
  | 'xp_orb'
  | 've_coin'
  | 'reward_gem'
  | 'treasure_chest'
  | 'level_badge'
  | 'streak_emblem';

export interface MemorySymbolDef {
  id: MemorySymbolId;
  label: string;
  accentColor: string;
}

export interface EarningOpportunity {
  id: string;
  title: string;
  description: string;
  xpPreview: string;
  ctaLabel: string;
  route: string;
  actionType: 'scroll_game' | 'modal_preview' | 'coming_soon';
  badgeTag: 'active' | 'coming_soon' | 'concept';
  demoClaimXP?: number;
  isDemo: boolean;
}

export type ActivityCategory =
  | 'Tasks'
  | 'Referrals'
  | 'Games'
  | 'Streaks'
  | 'Daily Bonuses'
  | 'Challenges';

export interface XPActivityItem {
  id: string;
  title: string;
  category: ActivityCategory;
  xpAmount: number;
  veAmount?: number;
  timestamp: string;
  isDemo: boolean;
}

export const INITIAL_PROGRESSION_DATA: LevelProgressionConfig = {
  userName: 'VeLooper',
  currentLevel: 4,
  levelTitle: 'Velocity Voyager',
  currentXP: 6420,
  nextLevel: 5,
  nextLevelTitle: 'Apex Strategist',
  requiredXP: 8000,
  nextLevelReward: { type: 'VEs', amount: 500, secondaryType: 'Gems', secondaryAmount: 25 },
  todayStats: {
    xpEarnedToday: 215,
    tasksCompleted: 4,
    tasksTotal: 8,
    streakDays: 7,
    vesEarnedToday: 35,
  },
  isDemo: true,
};

export const INITIAL_ROADMAP_LEVELS: RoadmapLevelItem[] = [
  { level: 1, title: 'Starter Spark', requiredXP: 1000, reward: { type: 'VEs', amount: 50 }, perks: ['Base XP earning rate', 'Daily Tasks access'], status: 'completed', isDemo: true },
  { level: 2, title: 'Momentum Seeker', requiredXP: 2500, reward: { type: 'VEs', amount: 100 }, perks: ['Watch & Earn bonus eligibility', 'Profile tier shield'], status: 'completed', isDemo: true },
  { level: 3, title: 'Circuit Builder', requiredXP: 4500, reward: { type: 'Gems', amount: 10 }, perks: ['Referral milestone boost', 'Higher daily cap'], status: 'completed', isDemo: true },
  { level: 4, title: 'Velocity Voyager', requiredXP: 6000, reward: { type: 'Gems', amount: 15 }, perks: ['Current active tier', 'Memory Match access'], status: 'current', isDemo: true },
  { level: 5, title: 'Apex Strategist', requiredXP: 8000, reward: { type: 'VEs', amount: 500, secondaryType: 'Gems', secondaryAmount: 25 }, perks: ['Higher daily XP limit', 'Access to new challenges', 'Better reward opportunities'], status: 'next', isDemo: true },
  { level: 6, title: 'Vault Tactician', requiredXP: 11500, reward: { type: 'VEs', amount: 850, secondaryType: 'Gems', secondaryAmount: 40 }, perks: ['Priority reward drops', 'Extended streak multiplier'], status: 'locked', isDemo: true },
  { level: 7, title: 'Sovereign Elite', requiredXP: 16000, reward: { type: 'VEs', amount: 1500, secondaryType: 'Gems', secondaryAmount: 60 }, perks: ['Premier vault privileges', 'Exclusive seasonal missions'], status: 'locked', isDemo: true },
];

export const MEMORY_MATCH_CONFIG = {
  title: 'Reward Memory Match',
  totalPairs: 6,
  timeLimitSec: 45,
  moveLimit: 18,
  demoRoundCap: 3,
  demoRewards: { fullMatchXP: 20, fullMatchVEs: 15, partialMatchXP: 5 },
  symbols: [
    { id: 'xp_orb', label: 'XP Orb', accentColor: '#9f8fef' },
    { id: 've_coin', label: 'VE Coin', accentColor: '#e5b85b' },
    { id: 'reward_gem', label: 'Reward Gem', accentColor: '#34d399' },
    { id: 'treasure_chest', label: 'Reward Vault', accentColor: '#f5d380' },
    { id: 'level_badge', label: 'Level Crest', accentColor: '#60a5fa' },
    { id: 'streak_emblem', label: 'Streak Flame', accentColor: '#f59e0b' },
  ] as MemorySymbolDef[],
  isDemo: true,
};

export const EARNING_OPPORTUNITIES: EarningOpportunity[] = [
  { id: 'play-earn', title: 'Play & Earn', description: 'Clear Reward Memory Match within 45s and 18 moves for demo XP.', xpPreview: '+20 XP per clear', ctaLabel: 'Play Match', route: '#play-and-earn', actionType: 'scroll_game', badgeTag: 'active', isDemo: true },
  { id: 'watch-earn', title: 'Watch & Earn', description: 'Complete eligible partner video spots to build steady daily XP.', xpPreview: 'Up to +50 XP', ctaLabel: 'Open Watch & Earn', route: '/watch-and-earn', actionType: 'modal_preview', badgeTag: 'active', demoClaimXP: 50, isDemo: true },
  { id: 'daily-tasks', title: 'Daily Tasks', description: 'Complete verified daily platform tasks and routine check-ins.', xpPreview: 'Up to +30 XP', ctaLabel: 'View Daily Tasks', route: '/daily-tasks', actionType: 'modal_preview', badgeTag: 'active', demoClaimXP: 30, isDemo: true },
  { id: 'refer-earn', title: 'Refer & Earn', description: 'Invite friends to VELOOP Rewards and unlock milestone XP.', xpPreview: '+100 XP per invite', ctaLabel: 'Invite Friends', route: '/refer-and-earn', actionType: 'modal_preview', badgeTag: 'active', demoClaimXP: 100, isDemo: true },
  { id: 'daily-challenge', title: 'Daily Challenge', description: 'Complete today’s featured objective before midnight reset.', xpPreview: 'Up to +50 XP', ctaLabel: 'Coming Soon', route: '/challenges/daily', actionType: 'coming_soon', badgeTag: 'coming_soon', isDemo: true },
  { id: 'streak-xp', title: 'Streak XP', description: 'Maintain consecutive active days to activate compounding XP bonuses.', xpPreview: '+25 XP bonus', ctaLabel: 'Coming Soon', route: '/streaks', actionType: 'coming_soon', badgeTag: 'coming_soon', isDemo: true },
  { id: 'daily-mission', title: 'Daily Mission', description: 'Complete one focused multi-step mission curated for your level.', xpPreview: '+40 XP est.', ctaLabel: 'Concept', route: '/missions/daily', actionType: 'coming_soon', badgeTag: 'concept', isDemo: true },
  { id: 'bonus-missions', title: 'Bonus Missions', description: 'Unlock time-window missions when approaching a new level.', xpPreview: '+75 XP est.', ctaLabel: 'Concept', route: '/missions/bonus', actionType: 'coming_soon', badgeTag: 'concept', isDemo: true },
  { id: 'weekly-quest', title: 'Weekly Quest', description: 'Complete a 7-day progression milestone across supported pathways.', xpPreview: '+150 XP est.', ctaLabel: 'Concept', route: '/quests/weekly', actionType: 'coming_soon', badgeTag: 'concept', isDemo: true },
];

export const INITIAL_XP_ACTIVITY: XPActivityItem[] = [
  { id: 'act-1', title: 'Referral Milestone Bonus', category: 'Referrals', xpAmount: 20, timestamp: 'Today, 10:45 AM', isDemo: true },
  { id: 'act-2', title: 'Daily Task Completed', category: 'Tasks', xpAmount: 50, timestamp: 'Today, 09:12 AM', isDemo: true },
  { id: 'act-3', title: 'Watch & Earn Session', category: 'Daily Bonuses', xpAmount: 100, timestamp: 'Today, 08:30 AM', isDemo: true },
  { id: 'act-4', title: 'Reward Memory Match Clear', category: 'Games', xpAmount: 20, veAmount: 15, timestamp: 'Today, 07:50 AM', isDemo: true },
  { id: 'act-5', title: '7-Day Streak Consistency', category: 'Streaks', xpAmount: 25, timestamp: 'Today, 07:20 AM', isDemo: true },
  { id: 'act-6', title: 'Weekend Sprint Challenge', category: 'Challenges', xpAmount: 45, timestamp: 'Yesterday, 06:15 PM', isDemo: true },
];
