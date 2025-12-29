import { useQuery } from "@tanstack/react-query";
import { FlashcardService } from "../services/flashcard-service";

export function useDecks() {
  return useQuery({
    queryKey: ["decks"],
    queryFn: () => FlashcardService.getDecks(),
  });
}
