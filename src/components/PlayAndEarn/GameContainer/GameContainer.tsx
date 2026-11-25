import React from 'react';
import { Clock } from 'lucide-react';
import { MemoryRoundReward, useMemoryMatchGame } from '../../../hooks/useMemoryMatchGame';
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
      const label = reward.veEarned > 0 ? 'Reward Memory Match Clear' : 'Reward Memory Match Partial';
      onAwardXP(reward.xpEarned, label, reward.veEarned);
    }
  };

  const game = useMemoryMatchGame({ isUnavailable, onRoundComplete: handleRoundComplete });

  return (
    <section id="play-and-earn" className={`vlCard ${styles.container}`} aria-labelledby="game-heading">
      <div className={styles.header}>
        <div>
          <h2 id="game-heading" className={styles.title}>Play &amp; Earn · {game.config.title}</h2>
          <p className={styles.subtitle}>Skill-based card matching challenge · Demo reward prototype</p>
        </div>
        <span className={`${styles.roundsLeft} tabularNums`}>
          Demo Rounds: {game.roundsRemaining}/{game.config.demoRoundCap}
        </span>
      </div>

      {game.status === 'unavailable' && (
        <div className={styles.unavailableBox} role="status">
          <Clock size={30} color="var(--vl-soft-blue)" aria-hidden="true" />
          <h3 className="m-0 fw-bold" style={{ fontSize: '1.15rem' }}>New challenge coming soon</h3>
          <p className="m-0" style={{ fontSize: '0.85rem', color: 'var(--vl-text-secondary)' }}>
            Reward Memory Match is temporarily offline while new challenges are prepared.
          </p>
        </div>
      )}

      {game.status === 'start' && (
        <GameStart
          config={game.config}
          roundsRemaining={game.roundsRemaining}
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
          onBackToDashboard={() => {
            game.resetToStart();
            onBackToOverview();
          }}
        />
      )}
    </section>
  );
};
