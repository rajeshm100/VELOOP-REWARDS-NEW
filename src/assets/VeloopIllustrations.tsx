import React from 'react';
import { Coins, Flame, Gem, Shield, Sparkles, Vault } from 'lucide-react';
import { MemorySymbolId } from '../data/levelDashboardData';

const BADGE_PALETTES = {
  current: { outer: '#e5b85b', outerDark: '#9e711f', inner: '#1c2038', text: '#f8fafc', label: '#e5b85b' },
  completed: { outer: '#34d399', outerDark: '#167d57', inner: '#17272e', text: '#ecfdf5', label: '#6ee7b7' },
  next: { outer: '#60a5fa', outerDark: '#2563eb', inner: '#19223e', text: '#eff6ff', label: '#93c5fd' },
  locked: { outer: '#64748b', outerDark: '#334155', inner: '#181c2c', text: '#94a3b8', label: '#64748b' },
};

export const HexLevelBadge: React.FC<{
  level: number;
  size?: number;
  variant?: keyof typeof BADGE_PALETTES;
  withLaurel?: boolean;
}> = ({ level, size = 84, variant = 'current', withLaurel = false }) => {
  const c = BADGE_PALETTES[variant];
  const gradId = `hex-${variant}-${level}`;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.outer} />
          <stop offset="100%" stopColor={c.outerDark} />
        </linearGradient>
      </defs>

      {withLaurel && (
        <g stroke="#e5b85b" strokeWidth="2.2" strokeLinecap="round" opacity="0.9">
          <path d="M24 88 C12 72 12 46 25 30 M96 88 C108 72 108 46 95 30" />
          <path d="M16 66 L22 61 M15 54 L22 50 M104 66 L98 61 M105 54 L98 50" />
        </g>
      )}

      <polygon points="60,8 104,33 104,87 60,112 16,87 16,33" fill={`url(#${gradId})`} />
      <polygon points="60,15 97,36.5 97,83.5 60,105 23,83.5 23,36.5" fill={c.inner} />

      <text x="60" y="46" textAnchor="middle" fill={c.label} fontSize="10" fontWeight="700" letterSpacing="1.6">
        LEVEL
      </text>
      <text x="60" y="78" textAnchor="middle" fill={c.text} fontSize="31" fontWeight="700" fontFamily="JetBrains Mono, monospace">
        {String(level).padStart(2, '0')}
      </text>
    </svg>
  );
};

export const RewardChestIllustration: React.FC<{ size?: number }> = ({ size = 84 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <path d="M24 52 C24 36 38 28 60 28 C82 28 96 36 96 52 Z" fill="#2b3152" stroke="#e5b85b" strokeWidth="3" />
    <rect x="22" y="52" width="76" height="40" rx="8" fill="#1d223b" stroke="#e5b85b" strokeWidth="3" />
    <rect x="37" y="30" width="7" height="61" rx="2" fill="#e5b85b" opacity="0.85" />
    <rect x="76" y="30" width="7" height="61" rx="2" fill="#e5b85b" opacity="0.85" />
    <rect x="51" y="45" width="18" height="20" rx="4" fill="#f5d380" />
    <circle cx="60" cy="55" r="3" fill="#161827" />
  </svg>
);

export const LaurelTrophyIllustration: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <circle cx="60" cy="58" r="46" fill="rgba(229, 184, 91, 0.12)" />
    <g stroke="#e5b85b" strokeWidth="2.5" strokeLinecap="round">
      <path d="M32 88 C16 74 16 44 31 28 M88 88 C104 74 104 44 89 28" />
    </g>
    <polygon points="60,22 86,36 86,68 60,86 34,68 34,36" fill="#1e2238" stroke="#e5b85b" strokeWidth="3.2" />
    <polygon points="60,34 65.5,46 78,47.5 68.5,56.2 71,69 60,62.5 49,69 51.5,56.2 42,47.5 54.5,46" fill="#f5d380" />
    <rect x="44" y="91" width="32" height="8" rx="3" fill="#e5b85b" />
  </svg>
);

export const MemorySymbolIcon: React.FC<{ symbolId: MemorySymbolId; size?: number }> = ({
  symbolId,
  size = 28,
}) => {
  const icons: Record<MemorySymbolId, React.ReactNode> = {
    xp_orb: <Sparkles size={size} color="#9f8fef" aria-hidden="true" />,
    ve_coin: <Coins size={size} color="#e5b85b" aria-hidden="true" />,
    reward_gem: <Gem size={size} color="#34d399" aria-hidden="true" />,
    treasure_chest: <Vault size={size} color="#f5d380" aria-hidden="true" />,
    level_badge: <Shield size={size} color="#60a5fa" aria-hidden="true" />,
    streak_emblem: <Flame size={size} color="#f59e0b" aria-hidden="true" />,
  };

  return <>{icons[symbolId]}</>;
};
