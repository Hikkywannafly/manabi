"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMOJIS = ["🦊", "🐼", "🐱", "🐶", "🐭", "🐹", "🐰", "🐻"];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function LoadingCardGrid() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = useCallback(() => {
    const pairedEmojis = [...EMOJIS, ...EMOJIS];
    const shuffled = shuffleArray(pairedEmojis);
    const newCards: Card[] = shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsLocked(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (id: number) => {
    if (isLocked) return;

    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(id)) return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)),
    );

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsLocked(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setMatches((prev) => prev + 1);
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c,
          ),
        );
        setFlippedCards([]);
        setIsLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c,
            ),
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const isGameComplete = matches === EMOJIS.length;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-4">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-4 flex gap-4">
          <Badge variant="outline" className="py-1 text-lg">
            Moves: {moves}
          </Badge>
          <Badge variant="outline" className="py-1 text-lg">
            Matches: {matches}/{EMOJIS.length}
          </Badge>
        </div>

        {isGameComplete && (
          <div className="mb-4 text-center">
            <p className="mb-2 font-semibold text-green-600 text-lg">
              🎉 Congratulations! You won!
            </p>
            <Button onClick={initializeGame} variant="outline" size="sm">
              Play Again
            </Button>
          </div>
        )}

        <div className="grid w-full max-w-sm grid-cols-4 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              disabled={isLocked || card.isMatched}
              className={cn(
                "relative aspect-square w-full cursor-pointer [perspective:1000px]",
                card.isMatched && "cursor-default",
              )}
              aria-label={card.isFlipped ? card.emoji : "Hidden card"}
            >
              <div
                className={cn(
                  "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
                  (card.isFlipped || card.isMatched) &&
                    "[transform:rotateY(180deg)]",
                )}
              >
                <div className="absolute flex h-full w-full items-center justify-center rounded-lg bg-secondary font-bold text-2xl [backface-visibility:hidden]">
                  ?
                </div>
                <div
                  className={cn(
                    "absolute flex h-full w-full items-center justify-center rounded-lg text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    card.isMatched
                      ? "bg-green-100 dark:bg-green-900/50"
                      : "bg-primary/20",
                  )}
                >
                  {card.emoji}
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-muted-foreground text-sm">
          Click cards to find matching pairs!
        </p>
      </div>
    </div>
  );
}
