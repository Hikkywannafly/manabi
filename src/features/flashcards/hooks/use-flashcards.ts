import { useQuery } from "@tanstack/react-query";
import { FlashcardService } from "../services/flashcard-service";

export function useFlashcards(deckId: string) {
  return useQuery({
    queryKey: ["flashcards", deckId],
    queryFn: () => FlashcardService.getFlashcards(deckId),
    enabled: !!deckId,
  });
}
