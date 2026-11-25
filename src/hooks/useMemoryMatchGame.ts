import { useCallback, useEffect, useRef, useState } from 'react';
import { MEMORY_MATCH_CONFIG, MemorySymbolId } from '../data/levelDashboardData';

export type MemoryGameStatus = 'start' | 'playing' | 'result' | 'unavailable';

export interface MemoryCardItem {
  uid: string;
  symbolId: MemorySymbolId;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryRoundReward {
  xpEarned: number;
  veEarned: number;
  reason: string;
}

function createShuffledDeck(): MemoryCardItem[] {
  const doubled = [...MEMORY_MATCH_CONFIG.symbols, ...MEMORY_MATCH_CONFIG.symbols];

  for (let i = doubled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }

  return doubled.map((sym, idx) => ({
    uid: `${sym.id}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
    symbolId: sym.id,
    label: sym.label,
    isFlipped: false,
    isMatched: false,
  }));
}

export function useMemoryMatchGame({
  isUnavailable = false,
  onRoundComplete,
}: {
  isUnavailable?: boolean;
  onRoundComplete?: (reward: MemoryRoundReward) => void;
}) {
  const [status, setStatus] = useState<MemoryGameStatus>(isUnavailable ? 'unavailable' : 'start');
  const [cards, setCards] = useState<MemoryCardItem[]>(() => createShuffledDeck());
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [movesUsed, setMovesUsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(MEMORY_MATCH_CONFIG.timeLimitSec);
  const [roundScore, setRoundScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [isBoardLocked, setIsBoardLocked] = useState(false);
  const [earnedReward, setEarnedReward] = useState<MemoryRoundReward | null>(null);

  const timerRef = useRef<number | null>(null);
  const mismatchRef = useRef<number | null>(null);
  const finalizingRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mismatchRef.current !== null) {
      window.clearTimeout(mismatchRef.current);
      mismatchRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isUnavailable) {
      clearTimers();
      setStatus('unavailable');
    } else if (status === 'unavailable') {
      setStatus('start');
    }
  }, [isUnavailable, status, clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  const finishRound = useCallback(
    (pairs: number, moves: number, timeLeft: number, reason: string) => {
      if (finalizingRef.current) return;
      finalizingRef.current = true;
      clearTimers();
      setIsBoardLocked(true);

      const fullClear = pairs >= MEMORY_MATCH_CONFIG.totalPairs;
      const xpEarned = fullClear
        ? MEMORY_MATCH_CONFIG.demoRewards.fullMatchXP
        : pairs > 0
          ? MEMORY_MATCH_CONFIG.demoRewards.partialMatchXP
          : 0;
      const veEarned = fullClear ? MEMORY_MATCH_CONFIG.demoRewards.fullMatchVEs : 0;
      const bonus = fullClear ? (MEMORY_MATCH_CONFIG.moveLimit - moves) * 4 + Math.min(28, timeLeft * 2) : 0;

      const reward: MemoryRoundReward = { xpEarned, veEarned, reason };
      setRoundScore(Math.min(100, pairs * 12 + Math.max(0, bonus)));
      setEarnedReward(reward);
      setStatus('result');
      onRoundComplete?.(reward);
    },
    [clearTimers, onRoundComplete]
  );

  const startRound = useCallback(() => {
    if (isUnavailable || roundsPlayed >= MEMORY_MATCH_CONFIG.demoRoundCap) return;
    clearTimers();
    finalizingRef.current = false;

    setCards(createShuffledDeck());
    setFlippedIds([]);
    setMatchedPairs(0);
    setMovesUsed(0);
    setTimeRemaining(MEMORY_MATCH_CONFIG.timeLimitSec);
    setRoundScore(0);
    setEarnedReward(null);
    setIsBoardLocked(false);
    setRoundsPlayed((p) => p + 1);
    setStatus('playing');
  }, [clearTimers, isUnavailable, roundsPlayed]);

  useEffect(() => {
    if (status !== 'playing') return;
    timerRef.current = window.setInterval(() => {
      setTimeRemaining((p) => (p <= 1 ? 0 : p - 1));
    }, 1000);
    return clearTimers;
  }, [status, clearTimers]);

  useEffect(() => {
    if (status === 'playing' && timeRemaining === 0 && !finalizingRef.current) {
      finishRound(matchedPairs, movesUsed, 0, 'Time expired before clearing all 6 pairs.');
    }
  }, [status, timeRemaining, matchedPairs, movesUsed, finishRound]);

  const selectCard = useCallback(
    (cardUid: string) => {
      if (status !== 'playing' || isBoardLocked || finalizingRef.current) return;
      const target = cards.find((c) => c.uid === cardUid);
      if (!target || target.isFlipped || target.isMatched || flippedIds.includes(cardUid)) return;

      const nextCards = cards.map((c) => (c.uid === cardUid ? { ...c, isFlipped: true } : c));
      const nextFlipped = [...flippedIds, cardUid];
      setCards(nextCards);
      setFlippedIds(nextFlipped);
      if (nextFlipped.length < 2) return;

      const nextMoves = movesUsed + 1;
      setMovesUsed(nextMoves);

      const [firstId, secondId] = nextFlipped;
      const first = nextCards.find((c) => c.uid === firstId);
      const second = nextCards.find((c) => c.uid === secondId);
      if (!first || !second) {
        setFlippedIds([]);
        return;
      }

      if (first.symbolId === second.symbolId) {
        const nextMatched = matchedPairs + 1;
        setCards((prev) =>
          prev.map((c) => (c.uid === firstId || c.uid === secondId ? { ...c, isMatched: true, isFlipped: true } : c))
        );
        setMatchedPairs(nextMatched);
        setFlippedIds([]);

        if (nextMatched >= MEMORY_MATCH_CONFIG.totalPairs) {
          finishRound(nextMatched, nextMoves, timeRemaining, 'All 6 VELOOP pairs matched within the limit.');
        } else if (nextMoves >= MEMORY_MATCH_CONFIG.moveLimit) {
          finishRound(nextMatched, nextMoves, timeRemaining, 'Move limit reached (18 moves).');
        }
        return;
      }

      setIsBoardLocked(true);
      mismatchRef.current = window.setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.uid === firstId || c.uid === secondId ? { ...c, isFlipped: false } : c))
        );
        setFlippedIds([]);
        setIsBoardLocked(false);
        mismatchRef.current = null;
        if (nextMoves >= MEMORY_MATCH_CONFIG.moveLimit) {
          finishRound(matchedPairs, nextMoves, timeRemaining, 'Move limit reached (18 moves).');
        }
      }, 700);
    },
    [status, isBoardLocked, cards, flippedIds, movesUsed, matchedPairs, timeRemaining, finishRound]
  );

  const resetToStart = useCallback(() => {
    clearTimers();
    finalizingRef.current = false;
    setCards(createShuffledDeck());
    setFlippedIds([]);
    setMatchedPairs(0);
    setMovesUsed(0);
    setTimeRemaining(MEMORY_MATCH_CONFIG.timeLimitSec);
    setEarnedReward(null);
    setIsBoardLocked(false);
    setStatus(isUnavailable ? 'unavailable' : 'start');
  }, [clearTimers, isUnavailable]);

  const resetDemoCap = useCallback(() => {
    setRoundsPlayed(0);
    resetToStart();
  }, [resetToStart]);

  return {
    config: MEMORY_MATCH_CONFIG,
    status,
    cards,
    matchedPairs,
    movesUsed,
    timeRemaining,
    roundScore,
    roundsRemaining: Math.max(0, MEMORY_MATCH_CONFIG.demoRoundCap - roundsPlayed),
    isBoardLocked,
    earnedReward,
    startRound,
    selectCard,
    resetToStart,
    resetDemoCap,
  };
}
