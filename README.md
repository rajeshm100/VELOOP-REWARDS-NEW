# VELOOP Rewards — Level-Up Dashboard Redesign (`/Lvl-Dashboard`)

## Project Overview
A fintech-inspired gamified **Level-Up, Rewards, Mini-Game, and Earning Hub** built for VELOOP Rewards (`Task 16`). The dashboard communicates where the user stands, how far they have progressed, what XP is needed next, what reward unlocks next, and actionable ways to keep progressing (`Play -> Earn XP -> Progress -> Unlock Reward -> Level Up -> Discover New Opportunities -> Return`).

> **Demo Data Notice:** All progression metrics, XP history entries, reward amounts, and mini-game payouts are labeled **development/demo data** until connected to live backend APIs.

---

## Level System
- Displays prominent **Current Level** (`Level 04 · Velocity Voyager`) with a gold-rimmed hexagonal badge and *"You are here"* indicator.
- Includes an interactive **Level Progression Roadmap** (`Levels 01–07`) distinguishing **Completed**, **You Are Here**, **Next Goal**, and **Locked** tiers.
- Clicking any roadmap level reveals threshold XP, unlocked rewards, and tier perks.
- Includes an `[i]` **Level Information** disclosure explaining how XP advances platform levels.

## XP System
- **Current XP:** Displays exact XP (`6,420 XP` / `6,420 / 8,000 XP` and `80%` progress).
- **XP Required:** Automatically calculates remaining XP (`1,580 XP to Level 05`) so users never perform mental math.
- **Animated Progress Bar:** Smoothly animates on mount while respecting `prefers-reduced-motion`.
- **Recent XP Activity:** Filterable by `All`, `Tasks`, `Referrals`, `Games`, `Streaks`, `Daily Bonuses`, and `Challenges`, paired with a daily summary and empty state (`"Your XP journey starts here"`).

## Next-Level Rewards
- Dedicated **Next-Level Reward** spotlight card (`+500 VEs` and `+25 Gems` demo configuration) with a locked reward chest visual, unlock percentage, **Preview Reward** toggle, and `[i]` **Reward Information** disclosure.
- **Level-Up Celebration (`LevelUpModal`):** Triggers cleanly when XP reaches or crosses `requiredXP`, presenting a refined achievement reveal and **Continue** action.

## Game Concept
**Reward Memory Match** (`Play & Earn`) is a calm, skill-based card-matching challenge built around VELOOP reward symbols (`XP Orb`, `VE Coin`, `Reward Gem`, `Reward Vault`, `Level Crest`, `Streak Flame`)—with zero casino, betting, or jackpot mechanics.

## Game Rules
- **Grid:** `4x3` responsive board (`12` cards = `6` matching pairs).
- **Time Limit:** `45 seconds` countdown timer.
- **Move Limit:** `18 moves` maximum per round (`1` move = flipping two cards).
- **Demo Rewards:**
  - Full Clear (`6/6` pairs within time & moves): `+20 XP` & `+15 VEs` (demo)
  - Partial Match (`1–5` pairs): `+5 XP` (demo)
  - `0` pairs: `0 XP`
- **Eligibility & Frequency:** Up to `3` demo rounds per session, disclosed upfront before starting.
- **States:** Start (`GameStart`), Gameplay (`GamePlay`), Result (`GameResult`), and Unavailable (`"New challenge coming soon"`).

## Earning Features
- **Supported Pathways:** Play & Earn (`Reward Memory Match`), Watch & Earn (`/watch-and-earn`), Daily Tasks (`/daily-tasks`), Refer & Earn (`/refer-and-earn`).
- **Coming Soon & Concept Pathways:** Daily Challenge, Streak XP, Daily Mission, Bonus Missions, XP Challenge, Weekly Quest, Quick Quiz, and Reward Hunt—clearly labeled `Coming Soon` or `Concept`.

## Technology Stack
- React.js 19 + TypeScript
- Vite
- Bootstrap 5 (responsive grid & layout)
- CSS Modules (`.module.css`) & `#161827` design tokens
- React Router (`react-router-dom`)
- Lucide React (`lucide-react`) & React Icons (`react-icons`)
- React Hooks (`useLevelProgress`, `useMemoryMatchGame`, `useDashboardData`, `useActivityFilter`, `useDisclosure`)

## Installation
```bash
npm install
```

## Development Commands
```bash
# Start local development server (port 3000)
npm run dev

# Type-check project
npm run lint

# Build production bundle
npm run build
```

## Folder Structure
```text
src/
├── assets/
│   └── VeloopIllustrations.tsx
├── components/
│   ├── CurrentLevel/
│   ├── EarnMoreXP/
│   ├── LevelHero/
│   ├── LevelInfo/
│   ├── LevelRewardCard/
│   ├── LevelRoadmap/
│   ├── LevelUpModal/
│   ├── NextLevelReward/
│   ├── PlayAndEarn/
│   │   ├── GameContainer/
│   │   ├── GamePlay/
│   │   ├── GameResult/
│   │   ├── GameStart/
│   │   └── Game.module.css
│   ├── XPActivity/
│   └── XPProgress/
├── data/
│   └── levelDashboardData.ts
├── hooks/
│   ├── useActivityFilter.ts
│   ├── useDashboardData.ts
│   ├── useDisclosure.ts
│   ├── useLevelProgress.ts
│   └── useMemoryMatchGame.ts
├── pages/
│   └── LevelDashboard/
├── styles/
│   ├── tokens.css
│   └── global.css
├── App.tsx
└── main.tsx
```

## Component Architecture
Each feature lives in an isolated, single-purpose folder with its own `.tsx` component and `.module.css` stylesheet, keeping business rules, timers, and demo data cleanly separated in `src/hooks/` and `src/data/`.

## Responsive Behavior
- **Mobile (`320px+`):** Single-column progression-first vertical flow with `3x4` memory cards and full-width CTAs.
- **Tablet (`768px+`):** Two-column top progression/reward pairing and 2-column earning grid.
- **Laptop (`1280px+`), Desktop (`1440px+`), Large Screens (`1920px+`):** Multi-column fintech hub with 3-column above-the-fold KPI/reward grid, 7-tier roadmap, side-by-side `Play & Earn` + `Recent XP Activity`, and 3-column `Earn More XP` grid.

## Animation Details
- Subtle XP bar fill animation on load (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Compositor-only hover elevations on level cards, reward chest, memory cards, and earning cards.
- Smooth `LevelUpModal` reveal without flashing or excessive confetti, honoring `prefers-reduced-motion`.

## Screenshots
Use the footer **View State** controls (`Normal`, `Loading`, `Empty Activity`, `Game Offline`, `Error`, `Test Level-Up`) alongside browser responsive emulation (`1440px`, `768px`, `375px`) to capture all 17 submission screenshots.

## Live Demo
Deploy the `/Lvl-Dashboard` route to Vercel or Netlify (SPA rewrites configured in `vercel.json`).

## GitHub Repository
Push source code, components, CSS Modules, data, assets, and configuration files (excluding `node_modules`, `.env`, and secrets).

## Author
VELOOP Rewards Frontend Engineering Team (Task 16 Redesign).
