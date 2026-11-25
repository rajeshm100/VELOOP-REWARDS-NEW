import React from 'react';
import { Play } from 'lucide-react';
import { MemorySymbolIcon } from '../../../assets/VeloopIllustrations';
import { MEMORY_MATCH_CONFIG } from '../../../data/levelDashboardData';
import styles from '../Game.module.css';

interface GameStartProps {
  config: typeof MEMORY_MATCH_CONFIG;
  roundsRemaining: number;
  onStart: () => void;
  onResetCap: () => void;
}

export const GameStart: React.FC<GameStartProps> = ({
  config,
  roundsRemaining,
  onStart,
  onResetCap,
}) => (
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

    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2 border-top" style={{ borderColor: 'var(--vl-border-subtle)' }}>
      <div className="d-flex align-items-center gap-2" aria-label="Memory card symbols">
        {config.symbols.map((sym) => (
          <span key={sym.id} title={sym.label}>
            <MemorySymbolIcon symbolId={sym.id} size={24} />
          </span>
        ))}
      </div>

      {roundsRemaining <= 0 ? (
        <button type="button" className="vlBtnGhost" onClick={onResetCap}>
          Reset Demo Rounds
        </button>
      ) : (
        <button type="button" className="vlBtnGold" onClick={onStart}>
          <Play size={16} aria-hidden="true" />
          Start Match
        </button>
      )}
    </div>
  </div>
);
