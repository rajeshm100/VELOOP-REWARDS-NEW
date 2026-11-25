import React from 'react';
import { RotateCcw } from 'lucide-react';
import { MemorySymbolIcon } from '../../../assets/VeloopIllustrations';
import { MemoryCardItem } from '../../../hooks/useMemoryMatchGame';
import styles from '../Game.module.css';

interface GamePlayProps {
  cards: MemoryCardItem[];
  matchedPairs: number;
  totalPairs: number;
  movesUsed: number;
  moveLimit: number;
  timeRemaining: number;
  isBoardLocked: boolean;
  onSelectCard: (uid: string) => void;
  onReset: () => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  cards,
  matchedPairs,
  totalPairs,
  movesUsed,
  moveLimit,
  timeRemaining,
  isBoardLocked,
  onSelectCard,
  onReset,
}) => {
  const isTimeLow = timeRemaining <= 10;

  return (
    <div className="d-flex flex-column gap-3">
      <div className={styles.hudBar} role="status" aria-live="polite">
        <div className={styles.hudStat}>
          <span className={styles.hudLabel}>Time Left</span>
          <span
            className={`${styles.hudValue} ${isTimeLow ? styles.hudUrgent : ''} tabularNums`}
          >
            {String(timeRemaining).padStart(2, '0')}s
          </span>
        </div>

        <div className={styles.hudStat}>
          <span className={styles.hudLabel}>Moves Used</span>
          <span className={`${styles.hudValue} tabularNums`}>
            {movesUsed} / {moveLimit}
          </span>
        </div>

        <div className={styles.hudStat}>
          <span className={styles.hudLabel}>Pairs Matched</span>
          <span className={`${styles.hudValue} tabularNums`} style={{ color: 'var(--vl-subtle-green)' }}>
            {matchedPairs} / {totalPairs}
          </span>
        </div>
      </div>

      <div
        className={styles.cardGrid}
        role="grid"
        aria-label="Reward Memory Match 4 by 3 card board"
      >
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;
          const cardLabel = card.isMatched
            ? `Card ${idx + 1}: ${card.label}, matched`
            : card.isFlipped
              ? `Card ${idx + 1}: ${card.label}, face up`
              : `Card ${idx + 1}: face down`;

          return (
            <button
              key={card.uid}
              type="button"
              className={`${styles.memoryCard} ${card.isFlipped && !card.isMatched ? styles.memoryCardFlipped : ''} ${card.isMatched ? styles.memoryCardMatched : ''}`}
              onClick={() => onSelectCard(card.uid)}
              disabled={isBoardLocked || card.isFlipped || card.isMatched}
              aria-label={cardLabel}
              aria-pressed={isRevealed}
            >
              {isRevealed ? (
                <>
                  <MemorySymbolIcon symbolId={card.symbolId} size={36} />
                  <span className={styles.cardLabel}>{card.label}</span>
                </>
              ) : (
                <span className={styles.cardBackEmblem}>VE</span>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.gameFooterRow}>
        <span className={styles.helperNote}>
          {isBoardLocked
            ? 'Checking pair...'
            : 'Select two cards to find matching VELOOP symbols.'}
        </span>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onReset}
        >
          <RotateCcw size={14} aria-hidden="true" />
          Exit Round
        </button>
      </div>
    </div>
  );
};
