"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type {
  GeneratedFlashcard,
  QuestionFlashcard,
  VocabularyFlashcard,
} from "@/features/flashcards/stores/use-flashcard-store";

interface FlashcardCardEditorProps {
  flashcard: GeneratedFlashcard;
  flashcardIndex: number;
  onUpdate: (updatedFlashcard: GeneratedFlashcard) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddFlashcard?: (afterIndex: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

// Type guard functions
function isQuestionFlashcard(
  flashcard: GeneratedFlashcard,
): flashcard is QuestionFlashcard {
  return "question" in flashcard && "choices" in flashcard;
}

function isVocabularyFlashcard(
  flashcard: GeneratedFlashcard,
): flashcard is VocabularyFlashcard {
  return "vocabulary" in flashcard && "meaning" in flashcard;
}

export function FlashcardCardEditor({
  flashcard,
  flashcardIndex,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddFlashcard,
  canMoveUp,
  canMoveDown,
}: FlashcardCardEditorProps) {
  const [_isExpanded, _setIsExpanded] = useState(true);

  // Question type handlers
  const handleQuestionChange = (value: string) => {
    if (isQuestionFlashcard(flashcard)) {
      onUpdate({ ...flashcard, question: value });
    }
  };

  const handleChoiceChange = (choiceIndex: number, value: string) => {
    if (isQuestionFlashcard(flashcard)) {
      const updatedChoices = [...flashcard.choices];
      updatedChoices[choiceIndex] = value;
      onUpdate({ ...flashcard, choices: updatedChoices });
    }
  };

  const handleCorrectAnswerChange = (value: string) => {
    if (isQuestionFlashcard(flashcard)) {
      const choiceIndex = Number.parseInt(value, 10);
      onUpdate({ ...flashcard, correctAnswer: choiceIndex });
    }
  };

  const handleAddChoice = () => {
    if (isQuestionFlashcard(flashcard)) {
      const updatedChoices = [
        ...flashcard.choices,
        `Option ${flashcard.choices.length + 1}`,
      ];
      onUpdate({ ...flashcard, choices: updatedChoices });
    }
  };

  const handleDeleteChoice = (choiceIndex: number) => {
    if (isQuestionFlashcard(flashcard)) {
      if (flashcard.choices.length <= 2) return; // Minimum 2 choices
      const updatedChoices = flashcard.choices.filter(
        (_, index) => index !== choiceIndex,
      );

      // Adjust correctAnswer if necessary
      let newCorrectAnswer = flashcard.correctAnswer;
      if (choiceIndex === flashcard.correctAnswer) {
        newCorrectAnswer = 0; // Reset to first choice
      } else if (choiceIndex < flashcard.correctAnswer) {
        newCorrectAnswer = flashcard.correctAnswer - 1;
      }

      onUpdate({
        ...flashcard,
        choices: updatedChoices,
        correctAnswer: newCorrectAnswer,
      });
    }
  };

  // Vocabulary type handlers
  const handleVocabularyChange = (value: string) => {
    if (isVocabularyFlashcard(flashcard)) {
      onUpdate({ ...flashcard, vocabulary: value });
    }
  };

  const handleMeaningChange = (value: string) => {
    if (isVocabularyFlashcard(flashcard)) {
      onUpdate({ ...flashcard, meaning: value });
    }
  };

  const handleExampleChange = (value: string) => {
    if (isVocabularyFlashcard(flashcard)) {
      onUpdate({ ...flashcard, example: value });
    }
  };

  // Shared handlers
  const handleExplanationChange = (value: string) => {
    onUpdate({ ...flashcard, explanation: value });
  };

  return (
    <div>
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">
                Flashcard {flashcardIndex + 1}
              </span>
              {isVocabularyFlashcard(flashcard) && (
                <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700 text-xs">
                  Vocabulary
                </span>
              )}
              {isQuestionFlashcard(flashcard) && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700 text-xs">
                  Question
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isQuestionFlashcard(flashcard) && (
                <Button variant="outline" size="sm" onClick={handleAddChoice}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Choice
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Question Type Fields */}
            {isQuestionFlashcard(flashcard) && (
              <>
                {/* Question */}
                <div>
                  <Label
                    htmlFor={`question-${flashcard.id}`}
                    className="mb-2 block"
                  >
                    Question
                  </Label>
                  <Textarea
                    id={`question-${flashcard.id}`}
                    value={flashcard.question}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                    placeholder="Enter your flashcard question here..."
                    rows={3}
                  />
                </div>

                {/* Multiple Choice Answers */}
                <div>
                  <Label className="mb-3 block">Answer Choices</Label>
                  <RadioGroup
                    value={flashcard.correctAnswer.toString()}
                    onValueChange={handleCorrectAnswerChange}
                    className="space-y-3"
                  >
                    {flashcard.choices.map((choice, index) => {
                      const isCorrect = index === flashcard.correctAnswer;
                      return (
                        <div
                          key={index}
                          className={`flex items-start gap-2 rounded-md border p-3 ${
                            isCorrect
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`choice-${flashcard.id}-${index}`}
                            className="mt-2"
                          />
                          <div className="flex flex-1 items-center gap-2">
                            <Input
                              value={choice}
                              onChange={(e) =>
                                handleChoiceChange(index, e.target.value)
                              }
                              placeholder={`Choice ${index + 1}`}
                              className={isCorrect ? "bg-green-50" : ""}
                            />
                            {flashcard.choices.length > 2 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteChoice(index)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Vocabulary Type Fields */}
            {isVocabularyFlashcard(flashcard) && (
              <>
                {/* Vocabulary */}
                <div>
                  <Label
                    htmlFor={`vocabulary-${flashcard.id}`}
                    className="mb-2 block"
                  >
                    Vocabulary
                  </Label>
                  <Input
                    id={`vocabulary-${flashcard.id}`}
                    value={flashcard.vocabulary}
                    onChange={(e) => handleVocabularyChange(e.target.value)}
                    placeholder="Enter vocabulary word/phrase (e.g., coastal (adj.))"
                  />
                </div>

                {/* Meaning */}
                <div>
                  <Label
                    htmlFor={`meaning-${flashcard.id}`}
                    className="mb-2 block"
                  >
                    Meaning
                  </Label>
                  <Input
                    id={`meaning-${flashcard.id}`}
                    value={flashcard.meaning}
                    onChange={(e) => handleMeaningChange(e.target.value)}
                    placeholder="Enter meaning (e.g., thuộc ven biển)"
                  />
                </div>

                {/* Example */}
                <div>
                  <Label
                    htmlFor={`example-${flashcard.id}`}
                    className="mb-2 block"
                  >
                    Example
                  </Label>
                  <Textarea
                    id={`example-${flashcard.id}`}
                    value={flashcard.example}
                    onChange={(e) => handleExampleChange(e.target.value)}
                    placeholder="Enter example sentence..."
                    rows={2}
                  />
                </div>
              </>
            )}

            {/* Explanation (shared) */}
            <div>
              <Label
                htmlFor={`explanation-${flashcard.id}`}
                className="mb-2 block"
              >
                Explanation
              </Label>
              <Textarea
                id={`explanation-${flashcard.id}`}
                value={flashcard.explanation || ""}
                onChange={(e) => handleExplanationChange(e.target.value)}
                placeholder={
                  isVocabularyFlashcard(flashcard)
                    ? "Enter usage notes, collocations, synonyms..."
                    : "Explain why this answer is correct..."
                }
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {onAddFlashcard && (
        <div className="group relative my-4">
          <div className="absolute top-1/2 w-full border-gray-100 border-t dark:border-gray-700" />

          <div className="flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddFlashcard(flashcardIndex)}
              className="relative z-10 bg-white px-3 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-900"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Flashcard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
