import React from 'react';
import { MemorySymbolId } from '../data/levelDashboardData';

interface HexLevelBadgeProps {
  level: number;
  size?: number;
  variant?: 'current' | 'completed' | 'next' | 'locked';
  withLaurel?: boolean;
}

export const HexLevelBadge: React.FC<HexLevelBadgeProps> = ({
  level,
  size = 84,
  variant = 'current',
  withLaurel = false,
}) => {
  const formatted = String(level).padStart(2, '0');

  const palette = {
    current: {
      outer: '#e5b85b',
      outerDark: '#9e711f',
      innerTop: '#262b47',
      innerBottom: '#151829',
      text: '#f8fafc',
      label: '#e5b85b',
    },
    completed: {
      outer: '#34d399',
      outerDark: '#167d57',
      innerTop: '#1d3237',
      innerBottom: '#131d26',
      text: '#ecfdf5',
      label: '#6ee7b7',
    },
    next: {
      outer: '#60a5fa',
      outerDark: '#2563eb',
      innerTop: '#222b49',
      innerBottom: '#14182b',
      text: '#eff6ff',
      label: '#93c5fd',
    },
    locked: {
      outer: '#64748b',
      outerDark: '#334155',
      innerTop: '#1d2133',
      innerBottom: '#141724',
      text: '#94a3b8',
      label: '#64748b',
    },
  }[variant];

  const gradId = `hexGrad-${variant}-${level}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={palette.outer} />
          <stop offset="100%" stopColor={palette.outerDark} />
        </linearGradient>
        <linearGradient id={`${gradId}-inner`} x1="60" y1="18" x2="60" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={palette.innerTop} />
          <stop offset="100%" stopColor={palette.innerBottom} />
        </linearGradient>
      </defs>

      {withLaurel && (
        <g stroke="#e5b85b" strokeWidth="2.2" strokeLinecap="round" opacity="0.9">
          <path d="M24 88 C12 72 12 46 25 30" />
          <path d="M96 88 C108 72 108 46 95 30" />
          <path d="M16 66 L22 61 M15 54 L22 50 M18 42 L25 40 M23 76 L28 70" />
          <path d="M104 66 L98 61 M105 54 L98 50 M102 42 L95 40 M97 76 L92 70" />
        </g>
      )}

      {/* Outer Metallic Hex Frame */}
      <polygon
        points="60,8 104,33 104,87 60,112 16,87 16,33"
        fill={`url(#${gradId})`}
      />
      {/* Inner Dark Navy Shield */}
      <polygon
        points="60,15 97,36.5 97,83.5 60,105 23,83.5 23,36.5"
        fill={`url(#${gradId}-inner)`}
      />
      {/* Subtle Top Bevel Highlight */}
      <polygon
        points="60,19 93,38 93,48 60,29 27,48 27,38"
        fill="rgba(255,255,255,0.06)"
      />

      <text
        x="60"
        y="46"
        textAnchor="middle"
        fill={palette.label}
        fontSize="10"
        fontWeight="700"
        letterSpacing="1.6"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        LEVEL
      </text>
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fill={palette.text}
        fontSize="31"
        fontWeight="700"
        fontFamily="JetBrains Mono, monospace"
      >
        {formatted}
      </text>
    </svg>
  );
};

export const RewardChestIllustration: React.FC<{ size?: number; locked?: boolean }> = ({
  size = 96,
  locked = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="chestAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={locked ? 'rgba(96,165,250,0.22)' : 'rgba(229,184,91,0.3)'} />
        <stop offset="100%" stopColor="rgba(22,24,39,0)" />
      </radialGradient>
      <linearGradient id="goldTrim" x1="20" y1="30" x2="100" y2="95" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f5d380" />
        <stop offset="100%" stopColor="#b8872d" />
      </linearGradient>
    </defs>

    <circle cx="60" cy="62" r="52" fill="url(#chestAura)" />

    {/* Chest Lid */}
    <path
      d="M24 52 C24 36 38 28 60 28 C82 28 96 36 96 52 Z"
      fill="#2b3152"
      stroke="url(#goldTrim)"
      strokeWidth="3"
    />
    {/* Chest Base */}
    <rect
      x="22"
      y="52"
      width="76"
      height="40"
      rx="8"
      fill="#1d223b"
      stroke="url(#goldTrim)"
      strokeWidth="3"
    />
    {/* Metallic Straps */}
    <rect x="37" y="30" width="7" height="61" rx="2" fill="url(#goldTrim)" opacity="0.85" />
    <rect x="76" y="30" width="7" height="61" rx="2" fill="url(#goldTrim)" opacity="0.85" />
    {/* Center Lock Clasp */}
    <rect x="51" y="45" width="18" height="20" rx="4" fill="url(#goldTrim)" />
    <circle cx="60" cy="54" r="3" fill="#161827" />
    <path d="M58.5 55 L61.5 55 L62 61 L58 61 Z" fill="#161827" />

    {/* Floating VE Coin & Gem Accent */}
    <circle cx="95" cy="30" r="10" fill="#21253c" stroke="#e5b85b" strokeWidth="2" />
    <text
      x="95"
      y="34"
      textAnchor="middle"
      fill="#f5d380"
      fontSize="11"
      fontWeight="700"
      fontFamily="Plus Jakarta Sans, sans-serif"
    >
      V
    </text>
    <polygon points="24,25 32,32 24,40 16,32" fill="#34d399" opacity="0.9" />
  </svg>
);

export const LaurelTrophyIllustration: React.FC<{ size?: number }> = ({ size = 92 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="trophyGold" x1="30" y1="20" x2="90" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="50%" stopColor="#e5b85b" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="58" r="48" fill="rgba(229, 184, 91, 0.12)" />
    {/* Laurel branches */}
    <g stroke="#e5b85b" strokeWidth="2.5" strokeLinecap="round">
      <path d="M32 88 C16 74 16 44 31 28" />
      <path d="M88 88 C104 74 104 44 89 28" />
      <path d="M21 62 L28 57 M20 49 L27 46 M24 38 L31 36 M27 74 L33 68" />
      <path d="M99 62 L92 57 M100 49 L93 46 M96 38 L89 36 M93 74 L87 68" />
    </g>
    {/* Shield + Star */}
    <polygon
      points="60,22 86,36 86,68 60,86 34,68 34,36"
      fill="#1e2238"
      stroke="url(#trophyGold)"
      strokeWidth="3.5"
    />
    <polygon
      points="60,34 65.5,46 78,47.5 68.5,56.2 71,69 60,62.5 49,69 51.5,56.2 42,47.5 54.5,46"
      fill="url(#trophyGold)"
    />
    <rect x="44" y="91" width="32" height="8" rx="3" fill="url(#trophyGold)" />
  </svg>
);

export const RewardTowerIllustration: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <rect x="14" y="54" width="14" height="16" rx="3" fill="#272c46" stroke="#64748b" strokeWidth="1.5" />
    <rect x="33" y="40" width="14" height="30" rx="3" fill="#272c46" stroke="#60a5fa" strokeWidth="1.5" />
    <rect x="52" y="22" width="14" height="48" rx="3" fill="#2a2d44" stroke="#e5b85b" strokeWidth="1.8" />
    <path d="M18 46 L38 30 L57 14" stroke="#e5b85b" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
    <circle cx="59" cy="14" r="5" fill="#e5b85b" />
  </svg>
);

export const WalletFlowIllustration: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <rect x="20" y="34" width="44" height="30" rx="6" fill="#21253c" stroke="#e5b85b" strokeWidth="2" />
    <rect x="46" y="44" width="20" height="10" rx="3" fill="#272c46" stroke="#e5b85b" strokeWidth="1.5" />
    <circle cx="53" cy="49" r="2" fill="#f5d380" />
    <circle cx="28" cy="20" r="7" fill="#272c46" stroke="#e5b85b" strokeWidth="1.8" />
    <text x="28" y="23.5" textAnchor="middle" fill="#f5d380" fontSize="9" fontWeight="700">V</text>
    <circle cx="48" cy="16" r="6" fill="#272c46" stroke="#9f8fef" strokeWidth="1.8" />
    <path d="M32 27 L38 34 M46 23 L46 34" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const MemorySymbolIcon: React.FC<{ symbolId: MemorySymbolId; size?: number }> = ({
  symbolId,
  size = 38,
}) => {
  switch (symbolId) {
    case 'xp_orb':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="19" fill="rgba(159, 143, 239, 0.2)" stroke="#9f8fef" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="12" fill="#2d2654" />
          <text x="24" y="28" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            XP
          </text>
        </svg>
      );
    case 've_coin':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="19" fill="rgba(229, 184, 91, 0.2)" stroke="#e5b85b" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="13" fill="#3a2f15" />
          <text x="24" y="29" textAnchor="middle" fill="#f5d380" fontSize="14" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            V
          </text>
        </svg>
      );
    case 'reward_gem':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <polygon points="24,6 40,18 24,42 8,18" fill="rgba(52, 211, 153, 0.22)" stroke="#34d399" strokeWidth="2.4" />
          <polygon points="24,11 33,19 24,35 15,19" fill="#10b981" opacity="0.6" />
          <line x1="8" y1="18" x2="40" y2="18" stroke="#6ee7b7" strokeWidth="1.6" />
        </svg>
      );
    case 'treasure_chest':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M10 22 C10 14 16 11 24 11 C32 11 38 14 38 22 Z" fill="#2b3152" stroke="#e5b85b" strokeWidth="2.2" />
          <rect x="9" y="22" width="30" height="16" rx="4" fill="#1d223b" stroke="#e5b85b" strokeWidth="2.2" />
          <rect x="20" y="19" width="8" height="9" rx="2" fill="#f5d380" />
        </svg>
      );
    case 'level_badge':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <polygon points="24,5 40,14 40,34 24,43 8,34 8,14" fill="rgba(96, 165, 250, 0.18)" stroke="#60a5fa" strokeWidth="2.4" />
          <polygon points="24,14 27,20 34,21 29,26 30,33 24,29.5 18,33 19,26 14,21 21,20" fill="#93c5fd" />
        </svg>
      );
    case 'streak_emblem':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="19" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2.2" />
          <path
            d="M25 10 C29 17 34 20 34 27 C34 33 29.5 37 24 37 C18.5 37 14 33 14 27 C14 22 17.5 18.5 20 16 C20 20 22 21.5 23.5 20 C24.5 17 24.5 13 25 10 Z"
            fill="#fbbf24"
          />
        </svg>
      );
  }
};
