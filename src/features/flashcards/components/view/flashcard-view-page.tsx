"use client";

import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDeck } from "@/features/flashcards/actions";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  options: string[] | null;
  order_index: number;
}

interface Deck {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface FlashcardViewPageProps {
  deckId: string;
}

export function FlashcardViewPage({ deckId }: FlashcardViewPageProps) {
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDeck = async () => {
      setIsLoading(true);
      const result = await getDeck(deckId);

      if (result.success && result.deck && result.flashcards) {
        setDeck(result.deck);
        setFlashcards(result.flashcards);
      } else {
        toast.error(result.error || "Failed to load deck");
        router.push("/dashboard/flashcards");
      }
      setIsLoading(false);
    };

    loadDeck();
  }, [deckId, router]);

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!deck || flashcards.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="font-bold text-2xl">No flashcards found</h2>
          <Button
            onClick={() => router.push("/dashboard/flashcards")}
            className="mt-4"
          >
            Back to Flashcards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/flashcards")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Flashcards
        </Button>
        <h1 className="font-bold text-3xl">{deck.title}</h1>
        {deck.description && (
          <p className="mt-2 text-muted-foreground">{deck.description}</p>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <div className="flex gap-1">
          {flashcards.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded ${
                index === currentIndex ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Flashcard */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Question */}
            <div>
              <h2 className="mb-4 font-semibold text-xl">
                {currentCard.question}
              </h2>
            </div>

            {/* Options */}
            {currentCard.options && currentCard.options.length > 0 ? (
              <div className="space-y-3">
                {currentCard.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = option === currentCard.answer;
                  const showResult = showAnswer;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showAnswer}
                      className={`w-full rounded-lg border p-4 text-left transition-all ${
                        showResult
                          ? isCorrect
                            ? "border-green-500 bg-green-50"
                            : isSelected
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200"
                          : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && isCorrect && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                {!showAnswer ? (
                  <Button onClick={() => setShowAnswer(true)}>
                    Show Answer
                  </Button>
                ) : (
                  <div className="rounded-lg border border-green-500 bg-green-50 p-4">
                    <p className="font-medium text-green-900">
                      {currentCard.answer}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
