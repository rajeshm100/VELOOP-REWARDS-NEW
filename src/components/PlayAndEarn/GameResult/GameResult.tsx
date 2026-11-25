import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { LaurelTrophyIllustration } from '../../../assets/VeloopIllustrations';
import { MemoryRoundReward } from '../../../hooks/useMemoryMatchGame';
import styles from '../Game.module.css';

interface GameResultProps {
  matchedPairs: number;
  totalPairs: number;
  movesUsed: number;
  timeRemaining: number;
  roundScore: number;
  roundsRemaining: number;
  earnedReward: MemoryRoundReward | null;
  onPlayAgain: () => void;
  onResetCap: () => void;
  onBackToDashboard: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  matchedPairs,
  totalPairs,
  movesUsed,
  timeRemaining,
  roundScore,
  roundsRemaining,
  earnedReward,
  onPlayAgain,
  onResetCap,
  onBackToDashboard,
}) => {
  const isFullClear = matchedPairs >= totalPairs;

  return (
    <div className={styles.resultBox} role="region" aria-label="Match Result">
      <LaurelTrophyIllustration size={84} />

      <div>
        <h3 className={styles.resultTitle}>
          {isFullClear ? 'Challenge Complete' : 'Round Summary'}
        </h3>
        <p className={styles.resultReason}>
          {earnedReward?.reason ?? 'Match complete.'}
        </p>
      </div>

      <div className={styles.resultMetrics}>
        <div className={styles.resultMetricCard}>
          <span className={styles.hudLabel}>Round Score</span>
          <span className={`${styles.hudValue} tabularNums`}>{roundScore}</span>
        </div>

        <div className={styles.resultMetricCard}>
          <span className={styles.hudLabel}>Pairs Matched</span>
          <span className={`${styles.hudValue} tabularNums`}>
            {matchedPairs} / {totalPairs}
          </span>
        </div>

        <div className={styles.resultMetricCard}>
          <span className={styles.hudLabel}>Moves · Time Left</span>
          <span className={`${styles.hudValue} tabularNums`}>
            {movesUsed} · {timeRemaining}s
          </span>
        </div>
      </div>

      <div className={`${styles.rewardCallout} tabularNums`}>
        {earnedReward && earnedReward.xpEarned > 0
          ? `Demo Reward Earned: +${earnedReward.xpEarned} XP${earnedReward.veEarned > 0 ? ` & +${earnedReward.veEarned} VEs` : ''}`
          : 'No demo XP earned this round (match at least 1 pair for +5 XP)'}
      </div>

      <div className={styles.resultActions}>
        {roundsRemaining > 0 ? (
          <button
            type="button"
            className={styles.startBtn}
            onClick={onPlayAgain}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Play Again ({roundsRemaining} left)
          </button>
        ) : (
          <button
            type="button"
            className={styles.startBtn}
            onClick={onResetCap}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset Demo Rounds
          </button>
        )}

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onBackToDashboard}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
