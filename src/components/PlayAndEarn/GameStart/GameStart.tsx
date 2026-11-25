import React from 'react';
import { Play } from 'lucide-react';
import { MemorySymbolIcon } from '../../../assets/VeloopIllustrations';
import { MemoryMatchConfig } from '../../../data/levelDashboardData';
import styles from '../Game.module.css';

interface GameStartProps {
  config: MemoryMatchConfig;
  roundsRemaining: number;
  bestScore: number;
  onStart: () => void;
  onResetCap: () => void;
}

export const GameStart: React.FC<GameStartProps> = ({
  config,
  roundsRemaining,
  bestScore,
  onStart,
  onResetCap,
}) => {
  const capReached = roundsRemaining <= 0;

  return (
    <div className={styles.startBox}>
      <div className={styles.rulesGrid}>
        <div className={styles.ruleItem}>
          <span className={styles.ruleLabel}>Objective &amp; How to Play</span>
          <p className={styles.ruleValue}>
            Flip two cards at a time on the 4x3 board to match all 6 VELOOP symbol pairs.
          </p>
        </div>

        <div className={styles.ruleItem}>
          <span className={styles.ruleLabel}>Time &amp; Move Limits</span>
          <p className={`${styles.ruleValue} tabularNums`}>
            {config.timeLimitSec} seconds countdown · {config.moveLimit} moves max
          </p>
        </div>

        <div className={styles.ruleItem}>
          <span className={styles.ruleLabel}>Demo Reward Rules</span>
          <p className={styles.ruleValue}>
            Full Clear (6/6): +{config.demoRewards.fullMatchXP} XP &amp; +{config.demoRewards.fullMatchVEs} VEs · Partial (1–5): +{config.demoRewards.partialMatchXP} XP
          </p>
        </div>

        <div className={styles.ruleItem}>
          <span className={styles.ruleLabel}>Eligibility &amp; Frequency</span>
          <p className={`${styles.ruleValue} tabularNums`}>
            Up to {config.demoRoundCap} demo rounds per session ({roundsRemaining} remaining)
          </p>
        </div>
      </div>

      <div className={styles.symbolStrip}>
        <div className={styles.symbolIcons} aria-label="Memory card symbols">
          {config.symbols.map((sym) => (
            <span key={sym.id} title={sym.label}>
              <MemorySymbolIcon symbolId={sym.id} size={30} />
            </span>
          ))}
        </div>

        <div className={styles.headerControls}>
          {bestScore > 0 && (
            <span className={`${styles.helperNote} tabularNums`}>
              Best Score: {bestScore}
            </span>
          )}

          {capReached ? (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onResetCap}
            >
              Reset Demo Rounds
            </button>
          ) : (
            <button
              type="button"
              className={styles.startBtn}
              onClick={onStart}
            >
              <Play size={16} aria-hidden="true" />
              Start Match
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
