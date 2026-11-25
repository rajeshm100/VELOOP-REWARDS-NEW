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
}) => (
  <div className="d-flex flex-column gap-3">
    <div className={styles.hudBar} role="status" aria-live="polite">
      <div className={styles.hudStat}>
        <span className={styles.hudLabel}>Time Left</span>
        <span className={`${styles.hudValue} tabularNums`} style={{ color: timeRemaining <= 10 ? 'var(--vl-error)' : undefined }}>
          {String(timeRemaining).padStart(2, '0')}s
        </span>
      </div>

      <div className={styles.hudStat}>
        <span className={styles.hudLabel}>Moves Used</span>
        <span className={`${styles.hudValue} tabularNums`}>{movesUsed} / {moveLimit}</span>
      </div>

      <div className={styles.hudStat}>
        <span className={styles.hudLabel}>Pairs Matched</span>
        <span className={`${styles.hudValue} tabularNums`} style={{ color: 'var(--vl-subtle-green)' }}>
          {matchedPairs} / {totalPairs}
        </span>
      </div>
    </div>

    <div className={styles.cardGrid} role="grid" aria-label="Reward Memory Match 4 by 3 board">
      {cards.map((card, idx) => {
        const revealed = card.isFlipped || card.isMatched;
        const label = card.isMatched
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
            disabled={isBoardLocked || revealed}
            aria-label={label}
            aria-pressed={revealed}
          >
            {revealed ? (
              <>
                <MemorySymbolIcon symbolId={card.symbolId} size={30} />
                <span className={styles.cardLabel}>{card.label}</span>
              </>
            ) : (
              <span className={styles.cardBackEmblem}>VE</span>
            )}
          </button>
        );
      })}
    </div>

    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
      <span style={{ fontSize: '0.78rem', color: 'var(--vl-text-muted)' }}>
        {isBoardLocked ? 'Checking pair...' : 'Select two cards to match VELOOP symbols.'}
      </span>
      <button type="button" className="vlBtnGhost" onClick={onReset}>
        <RotateCcw size={14} aria-hidden="true" />
        Exit Round
      </button>
    </div>
  </div>
);
