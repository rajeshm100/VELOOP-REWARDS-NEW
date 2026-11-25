# VELOOP Rewards – Level-Up Dashboard Redesign (`plan2.md`)

## 1. Project Overview & Core Guardrails
* **Task & Route:** VELOOP Rewards Frontend Task 16 — complete redesign of `/Lvl-Dashboard` into a unified **Level-Up + Rewards + Mini-Game + Earning Hub** (`Play -> Earn XP -> Progress -> Unlock Reward -> Level Up -> Discover New Opportunities -> Return`).
* **Strict Planning Mode:** This document is a pure architectural, UX, data, debugging, and deployment plan with **zero application code**.
* **Original UI/UX (Not a Clone):** Do not copy, clone, or simply restyle the existing Level Dashboard. Use the 6-screen showcase on page 33 of `ProjectGuidelines.pdf` for visual/structural inspiration (gold-rimmed hexagonal badges, laurel accents, XP orbs, VE coins, gems, and progression screens) while building a fresh, original layout.
* **Preserve Existing Data & Functionality:** Keep existing level metrics, XP totals, reward structures, earning pathways, and route behaviors intact unless explicitly updated.
* **Honest Labels:** Clearly mark unconfirmed or unbuilt earning concepts as `Coming Soon` or `Concept`, and clearly treat all placeholder figures as **development/demo data** until connected to live backend APIs.

---

## 2. Visual Direction, Trust & Accessibility
* **Fintech-Gamified Balance:** Deliver a premium, modern, trustworthy fintech rewards hub—never a casino, betting platform, or noisy arcade.
  * **Avoid:** Casino aesthetics, jackpots, spin wheels, neon glare, flashing effects, excessive cartoon styling, rainbow gradients, and heavy confetti.
  * **Adopt:** Clean card surfaces, strong typography with tabular numerals, controlled gradients, meaningful illustrations (e.g., reward tower climb, glowing XP orb, premium reward chest, mini-game character, coins flowing toward wallet), and subtle motion.
* **Color System:**
  * **Page Background:** `#161827` project-wide body background.
  * **Supporting Palette:** Deep navy/slate surfaces, gold, silver, white, soft blue, warm yellow, muted purple, and subtle green used intentionally to distinguish **Current**, **Completed**, **Locked**, **Reward**, and **Progress** states.
* **Information Transparency:**
  * Provide `[i]` info triggers beside **Level Information** (how XP advances levels and unlocks rewards) and **Next-Level Reward** (reward configuration transparency and demo/live status).
* **Animations & Accessibility:**
  * Animate the XP bar smoothly on load; add subtle hover/click states on level cards, next-level rewards, and earning CTAs.
  * Ensure keyboard navigation, visible focus rings, high contrast over `#161827`, descriptive labels for memory cards, and `prefers-reduced-motion` support.

---

## 3. Above-the-Fold Progression, Roadmap & Level-Up Flow
* **Four Mandatory Core Metrics (Immediately Visible Above the Fold):**
  1. **Current Level:** Badge, level number, level title, and *"You are here"* indicator.
  2. **Current XP:** Exact current XP value (e.g., `6,420 XP` / `6,420 / 8,000 XP` + percentage).
  3. **XP Required:** Exact remaining XP calculated for the user (`1,580 XP to Level 05` / `1,580 XP Needed`) so no mental math is required.
  4. **Next Level & Next-Level Reward:** Clear next level indicator (`Level 04 -> Level 05`) paired with a locked/reveal **Next-Level Reward** spotlight (`500 VEs` or `20 Gems`, marked as demo data if placeholder) and a dynamic **Recommended for You** tip.
* **Level Roadmap (`LevelRoadmap` & `LevelRewardCard`):**
  * Displays multi-level progression (`Completed`, `You Are Here`, `Next Goal`, `Locked`) with per-level reward previews and hover/click details.
* **Level-Up Celebration (`LevelUpModal`):**
  * Triggers when earned XP reaches or crosses `requiredXP`, presenting a refined achievement reveal (level transition, unlocked reward, subtle badge/chest animation, and **Continue**) without heavy confetti.

---

## 4. Play & Earn: Reward Memory Match Specification
Replaces XP Catcher with **Reward Memory Match**, a calm, skill-based card-matching challenge built around VELOOP reward symbols.

* **Locked-In Game Parameters:**
  * **Grid & Symbols:** `4x3` responsive grid (`12` cards = `6` matching pairs) featuring VELOOP symbols (XP Orb, VE Coin, Reward Gem, Treasure Chest, Level Badge, Streak Emblem) on deep navy cards with gold trim.
  * **Time & Move Limits:** `45 seconds` countdown timer and `18 moves` maximum per round (1 move = flipping a pair of cards).
  * **Eligibility & Frequency (Demo Rule):** Available in the **Play & Earn** section with up to `3` demo rounds per session/day, clearly explained upfront with zero hidden mechanics.
* **Locked-In Demo Score & Reward Rules (Development/Demo Data):**
  * **Local Score Tracking:** Tracks `pairsMatched` (`0–6`), `movesUsed`, `timeRemaining`, and `roundScore` locally.
  * **Full Clear (All 6 Pairs in Time & Moves):** `+20 XP` demo reward (or `+15 VEs` when configured for VEs in demo mode).
  * **Partial Match (`1–5` Pairs Before Timeout/Move Limit):** `+5 XP` demo reward (`0 XP` if `0` pairs matched).
  * **Prototype Separation:** Keep local prototype game state cleanly isolated from future backend reward processing.
* **Game States:**
  * **Start (`GameStart`):** Displays rules, objective, `45s` / `18` move limits, demo reward disclosure, and **Start Match**.
  * **Gameplay (`GamePlay`):** Displays interactive `4x3` card grid, live timer, moves/pairs counter, mismatch flip-back lock (blocking extra clicks while two non-matching cards flip back), and match highlights.
  * **Result (`GameResult`):** Shows pairs matched, moves/time summary, demo reward earned, **Play Again**, and **Back to Dashboard** (triggering `LevelUpModal` if earned XP crosses `requiredXP`).
  * **Unavailable (`Empty`):** Displays *"New challenge coming soon"* when no active challenge is available.

---

## 5. Earn More XP & Recent XP Activity
* **Earn More XP & Rewards (`EarnMoreXP`):**
  * **Existing / Supported Pathways (Preserve Routes & Actions):** Watch & Earn, Daily Tasks, Refer & Earn, and Play & Earn (Reward Memory Match).
  * **Expanded & New Concepts (Tag as `Coming Soon` or `Concept` Unless Approved):** Daily Challenge, Daily Mission, Streak XP, Bonus Missions, XP Challenge, Weekly Quest, Quick Quiz, and Reward Hunt.
  * **Action Hub Framing:** Includes a *"Ways to reach your next level"* header showing remaining XP and interactive cards with hover CTA emphasis.
* **Recent XP Activity (`XPActivity`):**
  * Displays filterable recent XP gains by source/category (Tasks, Referrals, Games, Streaks, Daily Bonuses, Challenges) alongside a daily summary, clearly marked as demo data until connected to live history.

---

## 6. Tech Stack, Responsive Layout & Beginner-Friendly Architecture
* **Approved Stack (No Tailwind):** React.js, Vite, Bootstrap, CSS Modules (`.module.css`), React Hooks, and React Icons / Lucide React.
* **Responsive Breakpoints (Intentional Layouts, Not Shrunk Desktop):**
  * **Mobile (`320px+`):** Single-column progression-first flow: `Level Hero + Current XP + XP Required` -> `Next-Level Reward` -> `Level Roadmap` -> `Reward Memory Match` -> `Earn More XP` -> `Recent XP Activity`.
  * **Tablet (`768px+`):** Two-column pairings for top progression/reward cards and a 2-column earning grid, with spacious card tap targets for Reward Memory Match.
  * **Laptop (`1280px`), Desktop (`1440px`) & Large Screens (`1920px+`):** Multi-column fintech hub with `Current Level + XP Progress` alongside `Next-Level Reward` at the top, full-width `Level Roadmap`, side-by-side `Reward Memory Match + Recent XP Activity`, and a 3-column `Earn More XP` grid.
* **Beginner-Friendly Folder & Module Layout (`src/`):**
  * `src/pages/LevelDashboard/` — Page grid orchestration and UX state switching.
  * `src/components/` — Small, single-purpose components (`LevelHero/`, `CurrentLevel/`, `XPProgress/`, `NextLevelReward/`, `LevelRoadmap/`, `LevelRewardCard/`, `PlayAndEarn/` with `GameContainer/`, `GameStart/`, `GamePlay/`, `GameResult/`, `Game.module.css`, plus `EarnMoreXP/`, `XPActivity/`, `LevelInfo/`, `LevelUpModal/`).
  * `src/data/` — Plain configuration and clearly labeled demo datasets.
  * `src/hooks/` — Small, focused hooks (`useLevelProgress`, `useMemoryMatchGame`, `useDashboardData`, `useActivityFilter`, `useDisclosure`).
  * `src/assets/` & `src/styles/` — Lightweight SVG/image assets, `#161827` theme variables, and reduced-motion/focus styles.
* **Code Readability Standards:** Keep functions short, avoid deep nesting, leave clean blank lines between logical blocks, and keep business/game state out of JSX markup.

---

## 7. Data Architecture & Development/Demo Data Fields
All dummy data resides in `src/data/` with `isDemo: true` markers so backend responses can replace it seamlessly:

* **Progression & Reward Config:**
  * `currentLevel`, `levelTitle`, `currentXP`, `nextLevel`, `nextLevelTitle`, `requiredXP`, `nextLevelReward: { type, amount }`, `isDemo`
  * Derived in `useLevelProgress`: `remainingXP = Math.max(0, requiredXP - currentXP)` and clamped `progressPercent` (`0–100%`).
* **Roadmap Levels Config:**
  * Array of `{ level, title, requiredXP, reward: { type, amount }, status: "completed" | "current" | "next" | "locked", isDemo }`.
* **Reward Memory Match Config & State:**
  * Config: `gridSize: "4x3"`, `totalPairs: 6`, `timeLimitSec: 45`, `moveLimit: 18`, `demoRoundCap: 3`, `symbols: [{ id, label, category }]`, `demoRewards: { fullMatchXP: 20, partialMatchXP: 5 }`.
  * Local Round State: `status` (`start` | `playing` | `result` | `unavailable`), `cards`, `flippedIds`, `matchedPairs`, `movesUsed`, `timeRemaining`, `roundScore`, `earnedReward`, `isDemo`.
* **Earning Opportunities & XP History:**
  * `earningOpportunities`: `{ id, title, description, xpPreview, ctaLabel, route, badgeTag: "active" | "coming_soon" | "concept", isDemo }`.
  * `xpHistory`: `{ id, title, category, xpAmount, timestamp, isDemo }`.

---

## 8. UX States, Practical Debugging & Free-Tier Workflow
* **Complete UX State Coverage:**
  * **Loading State:** Section-level skeleton placeholders over `#161827`.
  * **Empty States:** *"Your XP journey starts here"* with **Start Earning XP ->** when activity is empty; *"New challenge coming soon"* when Reward Memory Match is unavailable.
  * **Error State:** *"Unable to Load Level Progress"* / *"We couldn't load your level information right now"* with **Try Again** (never displaying raw API/server errors).
* **Practical Debugging Checklist:**
  * Clear every `setInterval` (countdown timer) and `setTimeout` (mismatch flip-back delay) on round reset, game completion, or component unmount.
  * Block extra card clicks while two mismatched cards are flipping back, and prevent double-counting matched pairs.
  * Test edge cases: `0` XP, exact level-up threshold (`currentXP === requiredXP`), winning on the final second/move, empty lists, and **Try Again** error recovery.
  * Resolve all React console errors and warnings before creating a production build.
* **Free-Plan Development & Deployment Workflow:**
  * Keep dependencies and assets lightweight so local builds and free CI pipelines stay fast.
  * Test locally with `npm run dev` and verify `npm run build` passes cleanly.
  * Push clean code to GitHub while excluding `node_modules`, `.env`, API keys, passwords, and secrets.
  * Deploy to **Vercel** (recommended) or **Netlify**, verify `/Lvl-Dashboard` live, and complete `README.md` plus all **17** required screenshots (Desktop, Tablet, Mobile, Current Level, XP Progress, Next Level, Next Level Reward, Level Roadmap, Game Start, Game Gameplay, Game Result, Earning Features, XP Activity, Level-Up Celebration, Loading State, Empty State, and Error State) within the **20–24 day** schedule by **5:30 P.M. (IST)**.