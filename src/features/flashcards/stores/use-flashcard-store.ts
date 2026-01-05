import { create } from "zustand";
import { persist } from "zustand/middleware";

// Questions type flashcard
export interface QuestionFlashcard {
  id: string | number;
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation?: string;
}

// Vocabulary type flashcard
export interface VocabularyFlashcard {
  id: string | number;
  vocabulary: string;
  meaning: string;
  example: string;
  explanation: string;
}

// Simple type flashcard (front/back)
export interface SimpleFlashcard {
  id: string | number;
  front: string;
  back: string;
  explanation?: string;
}

// Union type for all flashcard types
export type GeneratedFlashcard =
  | QuestionFlashcard
  | VocabularyFlashcard
  | SimpleFlashcard;

export interface FlashcardMetadata {
  flashcardType?: "QUESTIONS" | "VOCABULARY";
  difficulty?: string;
  total_cards?: number;
  estimated_study_time?: number;
  categoryId?: number;
  tags?: string[];
}

interface FlashcardStore {
  generatedFlashcards: GeneratedFlashcard[];
  deckTitle: string;
  deckDescription: string;
  metadata: FlashcardMetadata;
  setGeneratedFlashcards: (
    flashcards: GeneratedFlashcard[],
    title: string,
    description: string,
    metadata?: FlashcardMetadata,
  ) => void;
  updateFlashcardMetadata: (updates: {
    title?: string;
    description?: string;
  }) => void;
  addFlashcard: (flashcard: GeneratedFlashcard) => void;
  addFlashcardAfter: (
    afterIndex: number,
    flashcard: GeneratedFlashcard,
  ) => void;
  updateFlashcard: (
    flashcardId: number | string,
    updates: Partial<GeneratedFlashcard>,
  ) => void;
  deleteFlashcard: (flashcardId: number | string) => void;
  moveFlashcard: (fromIndex: number, toIndex: number) => void;
  clearFlashcards: () => void;
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set) => ({
      generatedFlashcards: [],
      deckTitle: "",
      deckDescription: "",
      metadata: {},
      setGeneratedFlashcards: (flashcards, title, description, metadata = {}) =>
        set({
          generatedFlashcards: flashcards,
          deckTitle: title,
          deckDescription: description,
          metadata: {
            ...metadata,
            total_cards: flashcards.length,
          },
        }),
      updateFlashcardMetadata: (updates) =>
        set((state) => ({
          deckTitle: updates.title ?? state.deckTitle,
          deckDescription: updates.description ?? state.deckDescription,
        })),
      addFlashcard: (flashcard) =>
        set((state) => ({
          generatedFlashcards: [
            ...state.generatedFlashcards,
            { ...flashcard, id: flashcard.id || Date.now() + Math.random() },
          ],
          metadata: {
            ...state.metadata,
            total_cards: state.generatedFlashcards.length + 1,
          },
        })),
      addFlashcardAfter: (afterIndex, flashcard) =>
        set((state) => {
          const newFlashcards = [...state.generatedFlashcards];
          newFlashcards.splice(afterIndex + 1, 0, {
            ...flashcard,
            id: flashcard.id || Date.now() + Math.random(),
          });
          return {
            generatedFlashcards: newFlashcards,
            metadata: {
              ...state.metadata,
              total_cards: newFlashcards.length,
            },
          };
        }),
      updateFlashcard: (flashcardId, updates) =>
        set((state) => {
          const flashcardIndex = state.generatedFlashcards.findIndex(
            (fc) => fc.id === flashcardId,
          );
          if (flashcardIndex === -1) return state;

          const newFlashcards = [...state.generatedFlashcards];
          newFlashcards[flashcardIndex] = {
            ...newFlashcards[flashcardIndex],
            ...updates,
          };
          return { generatedFlashcards: newFlashcards };
        }),
      deleteFlashcard: (flashcardId) =>
        set((state) => {
          const newFlashcards = state.generatedFlashcards.filter(
            (fc) => fc.id !== flashcardId,
          );
          return {
            generatedFlashcards: newFlashcards,
            metadata: {
              ...state.metadata,
              total_cards: newFlashcards.length,
            },
          };
        }),
      moveFlashcard: (fromIndex, toIndex) =>
        set((state) => {
          const newFlashcards = [...state.generatedFlashcards];
          const [movedFlashcard] = newFlashcards.splice(fromIndex, 1);
          newFlashcards.splice(toIndex, 0, movedFlashcard);
          return { generatedFlashcards: newFlashcards };
        }),
      clearFlashcards: () =>
        set({
          generatedFlashcards: [],
          deckTitle: "",
          deckDescription: "",
          metadata: {},
        }),
    }),
    {
      name: "flashcard-store",
      partialize: (state) => ({
        generatedFlashcards: state.generatedFlashcards,
        deckTitle: state.deckTitle,
        deckDescription: state.deckDescription,
        metadata: state.metadata,
      }),
    },
  ),
);
