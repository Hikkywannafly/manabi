import { useCallback, useState } from "react";
import { toast } from "sonner";
import { FlashcardService } from "../services/flashcard-service";
import type { FlashcardWithReview } from "../types";

export function useStudySession(cards: FlashcardWithReview[] = []) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [history, setHistory] = useState<
    Record<string, "again" | "hard" | "good" | "easy">
  >({});

  // Derived stats
  const sessionStats = {
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  };

  Object.values(history).forEach((rating) => {
    sessionStats[rating]++;
  });

  const currentCard = cards[currentIndex];
  // Consider finished if we passed the last index
  const isFinished = cards.length > 0 && currentIndex >= cards.length;

  const reveal = useCallback(() => setIsRevealed(true), []);

  const rate = useCallback(
    async (rating: "again" | "hard" | "good" | "easy") => {
      if (!currentCard) return;

      try {
        await FlashcardService.recordReview(currentCard.id, rating);

        setHistory((prev) => ({
          ...prev,
          [currentCard.id]: rating,
        }));

        // Move to next
        setIsRevealed(false);
        setCurrentIndex((prev) => prev + 1);
      } catch (e) {
        console.error(e);
        toast.error("Failed to save review");
      }
    },
    [currentCard],
  );

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setHistory({});
  }, []);

  return {
    currentCard,
    currentIndex,
    totalCards: cards.length,
    isRevealed,
    isFinished,
    reveal,
    rate,
    restart,
    sessionStats,
    history,
  };
}
