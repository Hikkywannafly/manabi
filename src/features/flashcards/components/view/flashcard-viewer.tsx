"use client";

import { motion } from "framer-motion";
import { Edit3, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { FlashcardWithReview } from "../../types";

interface FlashcardViewerProps {
  card: FlashcardWithReview;
  onEdit?: (card: FlashcardWithReview) => void;
  isFlipped?: boolean;
}

export function FlashcardViewer({
  card,
  onEdit,
  isFlipped: orderFlipped = false,
}: FlashcardViewerProps) {
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Reset flip state when card changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: We intentionally reset when card.id changes
  useEffect(() => {
    setIsCardFlipped(false);
  }, [card.id]);

  const handleFlip = () => {
    setIsCardFlipped((prev) => !prev);
  };

  // Determine which content to show based on both flip states
  const frontContent = orderFlipped ? card.back : card.front;
  const backContent = orderFlipped ? card.front : card.back;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Viewer Container */}
      <div className="perspective-1000 relative h-[400px] w-full">
        <motion.div
          className="preserve-3d relative h-full w-full cursor-pointer"
          animate={{ rotateY: isCardFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={handleFlip}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="backface-hidden absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex h-full flex-col justify-between rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex justify-between text-muted-foreground">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(card);
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement text-to-speech
                  }}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-1 items-center justify-center text-center">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown>{frontContent}</ReactMarkdown>
                </div>
              </div>
              <div className="text-center text-muted-foreground text-sm uppercase tracking-wider">
                Click to flip
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="backface-hidden absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex h-full flex-col justify-between rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex justify-between text-muted-foreground">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(card);
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement text-to-speech
                  }}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto text-center">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown>{backContent}</ReactMarkdown>
                </div>
              </div>
              <div className="text-center text-muted-foreground text-sm uppercase tracking-wider">
                Click to flip back
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
