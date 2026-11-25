import React from 'react';
import { Clock, Volume2, VolumeX } from 'lucide-react';
import {
  MemoryRoundReward,
  useMemoryMatchGame,
} from '../../../hooks/useMemoryMatchGame';
import { GamePlay } from '../GamePlay/GamePlay';
import { GameResult } from '../GameResult/GameResult';
import { GameStart } from '../GameStart/GameStart';
import styles from '../Game.module.css';

interface GameContainerProps {
  isUnavailable: boolean;
  onAwardXP: (xp: number, title: string, veEarned: number) => void;
  onBackToOverview: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  isUnavailable,
  onAwardXP,
  onBackToOverview,
}) => {
  const handleRoundComplete = (reward: MemoryRoundReward) => {
    if (reward.xpEarned > 0 || reward.veEarned > 0) {
      const label =
        reward.outcome === 'full_clear'
          ? 'Reward Memory Match Clear'
          : 'Reward Memory Match Partial';
      onAwardXP(reward.xpEarned, label, reward.veEarned);
    }
  };

  const game = useMemoryMatchGame({
    isUnavailable,
    onRoundComplete: handleRoundComplete,
  });

  const handleBackToDashboard = () => {
    game.resetToStart();
    onBackToOverview();
  };

  return (
    <section
      id="play-and-earn"
      className={styles.container}
      aria-labelledby="game-heading"
    >
      <div className={styles.header}>
        <div>
          <h2 id="game-heading" className={styles.title}>
            Play &amp; Earn · {game.config.title}
          </h2>
          <p className={styles.subtitle}>
            Skill-based card matching challenge · Development/demo reward prototype
          </p>
        </div>

        <div className={styles.headerControls}>
          <span className={`${styles.roundsLeft} tabularNums`}>
            Demo Rounds: {game.roundsRemaining}/{game.config.demoRoundCap}
          </span>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={game.toggleMute}
            aria-label={game.isMuted ? 'Unmute game chimes' : 'Mute game chimes'}
            title={game.isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {game.isMuted ? (
              <VolumeX size={16} aria-hidden="true" />
            ) : (
              <Volume2 size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {game.status === 'unavailable' && (
        <div className={styles.unavailableBox} role="status">
          <Clock size={32} color="var(--vl-soft-blue)" aria-hidden="true" />
          <h3 className={styles.resultTitle}>New challenge coming soon</h3>
          <p className={styles.resultReason}>
            Reward Memory Match is temporarily offline while new seasonal challenges are prepared.
          </p>
        </div>
      )}

      {game.status === 'start' && (
        <GameStart
          config={game.config}
          roundsRemaining={game.roundsRemaining}
          bestScore={game.bestScore}
          onStart={game.startRound}
          onResetCap={game.resetDemoCap}
        />
      )}

      {game.status === 'playing' && (
        <GamePlay
          cards={game.cards}
          matchedPairs={game.matchedPairs}
          totalPairs={game.config.totalPairs}
          movesUsed={game.movesUsed}
          moveLimit={game.config.moveLimit}
          timeRemaining={game.timeRemaining}
          isBoardLocked={game.isBoardLocked}
          onSelectCard={game.selectCard}
          onReset={game.resetToStart}
        />
      )}

      {game.status === 'result' && (
        <GameResult
          matchedPairs={game.matchedPairs}
          totalPairs={game.config.totalPairs}
          movesUsed={game.movesUsed}
          timeRemaining={game.timeRemaining}
          roundScore={game.roundScore}
          roundsRemaining={game.roundsRemaining}
          earnedReward={game.earnedReward}
          onPlayAgain={game.startRound}
          onResetCap={game.resetDemoCap}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </section>
  );
};
