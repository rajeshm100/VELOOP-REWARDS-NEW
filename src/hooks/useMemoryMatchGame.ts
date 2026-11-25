import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MEMORY_MATCH_CONFIG,
  MemorySymbolDef,
} from '../data/levelDashboardData';

export type MemoryGameStatus = 'start' | 'playing' | 'result' | 'unavailable';

export interface MemoryCardItem {
  uid: string;
  symbolId: MemorySymbolDef['id'];
  label: string;
  accentColor: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryRoundReward {
  xpEarned: number;
  veEarned: number;
  outcome: 'full_clear' | 'partial_match' | 'no_match';
  reason: string;
  isDemo: boolean;
}

interface PlaySoundType {
  type: 'flip' | 'match' | 'complete';
}

function playGentleChime({ type }: PlaySoundType, isMuted: boolean) {
  if (isMuted || typeof window === 'undefined') {
    return;
  }

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtx) {
      return;
    }

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'flip') {
      osc.frequency.setValueAtTime(420, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'match') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.06);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.32);
    }

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 450);
  } catch {
    // Ignore audio context restriction errors
  }
}

function createShuffledDeck(): MemoryCardItem[] {
  const doubled = [...MEMORY_MATCH_CONFIG.symbols, ...MEMORY_MATCH_CONFIG.symbols];

  for (let i = doubled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }

  return doubled.map((sym, index) => ({
    uid: `${sym.id}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    symbolId: sym.id,
    label: sym.label,
    accentColor: sym.accentColor,
    isFlipped: false,
    isMatched: false,
  }));
}

interface UseMemoryMatchGameOptions {
  isUnavailable?: boolean;
  onRoundComplete?: (reward: MemoryRoundReward) => void;
}

export function useMemoryMatchGame({
  isUnavailable = false,
  onRoundComplete,
}: UseMemoryMatchGameOptions) {
  const [status, setStatus] = useState<MemoryGameStatus>(
    isUnavailable ? 'unavailable' : 'start'
  );
  const [cards, setCards] = useState<MemoryCardItem[]>(() => createShuffledDeck());
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [movesUsed, setMovesUsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    MEMORY_MATCH_CONFIG.timeLimitSec
  );
  const [roundScore, setRoundScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [isBoardLocked, setIsBoardLocked] = useState(false);
  const [earnedReward, setEarnedReward] = useState<MemoryRoundReward | null>(
    null
  );
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<number | null>(null);
  const mismatchTimeoutRef = useRef<number | null>(null);
  const isFinalizingRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mismatchTimeoutRef.current !== null) {
      window.clearTimeout(mismatchTimeoutRef.current);
      mismatchTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isUnavailable) {
      clearAllTimers();
      setStatus('unavailable');
    } else if (status === 'unavailable') {
      setStatus('start');
    }
  }, [isUnavailable, status, clearAllTimers]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const finishRound = useCallback(
    (
      finalPairs: number,
      finalMoves: number,
      finalTimeLeft: number,
      reason: string
    ) => {
      if (isFinalizingRef.current) {
        return;
      }

      isFinalizingRef.current = true;
      clearAllTimers();
      setIsBoardLocked(true);

      const isFullClear = finalPairs >= MEMORY_MATCH_CONFIG.totalPairs;
      const xpEarned = isFullClear
        ? MEMORY_MATCH_CONFIG.demoRewards.fullMatchXP
        : finalPairs > 0
          ? MEMORY_MATCH_CONFIG.demoRewards.partialMatchXP
          : 0;
      const veEarned = isFullClear
        ? MEMORY_MATCH_CONFIG.demoRewards.fullMatchVEs
        : 0;

      const efficiencyBonus = isFullClear
        ? Math.max(0, MEMORY_MATCH_CONFIG.moveLimit - finalMoves) * 4
        : 0;
      const timeBonus = isFullClear ? finalTimeLeft * 2 : 0;
      const computedScore = Math.min(
        100,
        finalPairs * 12 + efficiencyBonus + Math.min(28, timeBonus)
      );

      const rewardPayload: MemoryRoundReward = {
        xpEarned,
        veEarned,
        outcome: isFullClear
          ? 'full_clear'
          : finalPairs > 0
            ? 'partial_match'
            : 'no_match',
        reason,
        isDemo: true,
      };

      setRoundScore(computedScore);
      setBestScore((prev) => Math.max(prev, computedScore));
      setEarnedReward(rewardPayload);
      setStatus('result');
      playGentleChime({ type: 'complete' }, isMuted);

      if (onRoundComplete) {
        onRoundComplete(rewardPayload);
      }
    },
    [clearAllTimers, isMuted, onRoundComplete]
  );

  const startRound = useCallback(() => {
    if (isUnavailable || roundsPlayed >= MEMORY_MATCH_CONFIG.demoRoundCap) {
      return;
    }

    clearAllTimers();
    isFinalizingRef.current = false;

    setCards(createShuffledDeck());
    setFlippedIds([]);
    setMatchedPairs(0);
    setMovesUsed(0);
    setTimeRemaining(MEMORY_MATCH_CONFIG.timeLimitSec);
    setRoundScore(0);
    setEarnedReward(null);
    setIsBoardLocked(false);
    setRoundsPlayed((prev) => prev + 1);
    setStatus('playing');
  }, [clearAllTimers, isUnavailable, roundsPlayed]);

  useEffect(() => {
    if (status !== 'playing') {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  useEffect(() => {
    if (status === 'playing' && timeRemaining === 0 && !isFinalizingRef.current) {
      finishRound(
        matchedPairs,
        movesUsed,
        0,
        'Time expired before clearing all 6 pairs.'
      );
    }
  }, [status, timeRemaining, matchedPairs, movesUsed, finishRound]);

  const selectCard = useCallback(
    (cardUid: string) => {
      if (status !== 'playing' || isBoardLocked || isFinalizingRef.current) {
        return;
      }

      const targetCard = cards.find((c) => c.uid === cardUid);
      if (!targetCard || targetCard.isFlipped || targetCard.isMatched) {
        return;
      }

      if (flippedIds.includes(cardUid)) {
        return;
      }

      playGentleChime({ type: 'flip' }, isMuted);

      const updatedCards = cards.map((card) =>
        card.uid === cardUid ? { ...card, isFlipped: true } : card
      );
      const nextFlipped = [...flippedIds, cardUid];

      setCards(updatedCards);
      setFlippedIds(nextFlipped);

      if (nextFlipped.length < 2) {
        return;
      }

      const nextMoves = movesUsed + 1;
      setMovesUsed(nextMoves);

      const [firstId, secondId] = nextFlipped;
      const firstCard = updatedCards.find((c) => c.uid === firstId);
      const secondCard = updatedCards.find((c) => c.uid === secondId);

      if (!firstCard || !secondCard) {
        setFlippedIds([]);
        return;
      }

      if (firstCard.symbolId === secondCard.symbolId) {
        const nextMatched = matchedPairs + 1;

        setCards((prevCards) =>
          prevCards.map((card) =>
            card.uid === firstId || card.uid === secondId
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          )
        );
        setMatchedPairs(nextMatched);
        setFlippedIds([]);
        playGentleChime({ type: 'match' }, isMuted);

        if (nextMatched >= MEMORY_MATCH_CONFIG.totalPairs) {
          finishRound(
            nextMatched,
            nextMoves,
            timeRemaining,
            'All 6 VELOOP pairs matched within the limit.'
          );
        } else if (nextMoves >= MEMORY_MATCH_CONFIG.moveLimit) {
          finishRound(
            nextMatched,
            nextMoves,
            timeRemaining,
            'Move limit reached (18 moves).'
          );
        }
        return;
      }

      // Mismatch: lock board during flip-back animation
      setIsBoardLocked(true);
      mismatchTimeoutRef.current = window.setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.uid === firstId || card.uid === secondId
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedIds([]);
        setIsBoardLocked(false);
        mismatchTimeoutRef.current = null;

        if (nextMoves >= MEMORY_MATCH_CONFIG.moveLimit) {
          finishRound(
            matchedPairs,
            nextMoves,
            timeRemaining,
            'Move limit reached (18 moves).'
          );
        }
      }, 720);
    },
    [
      status,
      isBoardLocked,
      cards,
      flippedIds,
      movesUsed,
      matchedPairs,
      timeRemaining,
      isMuted,
      finishRound,
    ]
  );

  const resetToStart = useCallback(() => {
    clearAllTimers();
    isFinalizingRef.current = false;
    setCards(createShuffledDeck());
    setFlippedIds([]);
    setMatchedPairs(0);
    setMovesUsed(0);
    setTimeRemaining(MEMORY_MATCH_CONFIG.timeLimitSec);
    setRoundScore(0);
    setEarnedReward(null);
    setIsBoardLocked(false);
    setStatus(isUnavailable ? 'unavailable' : 'start');
  }, [clearAllTimers, isUnavailable]);

  const resetDemoCap = useCallback(() => {
    setRoundsPlayed(0);
    resetToStart();
  }, [resetToStart]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    config: MEMORY_MATCH_CONFIG,
    status,
    cards,
    matchedPairs,
    movesUsed,
    timeRemaining,
    roundScore,
    bestScore,
    roundsPlayed,
    roundsRemaining: Math.max(0, MEMORY_MATCH_CONFIG.demoRoundCap - roundsPlayed),
    isBoardLocked,
    earnedReward,
    isMuted,
    startRound,
    selectCard,
    resetToStart,
    resetDemoCap,
    toggleMute,
  };
}
