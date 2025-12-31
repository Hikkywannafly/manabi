import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleErrorNotification } from "@/lib/notifications";
import { CollectionService } from "../services/collection-service";

export function useAddItemsToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      quizIds,
      deckIds,
    }: {
      collectionId: string;
      quizIds: string[];
      deckIds: string[];
    }) => {
      return CollectionService.addItemsToCollection(
        collectionId,
        quizIds,
        deckIds,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collection", variables.collectionId],
      });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      toast.success("Items added to collection successfully!");
    },
    onError: (error) => {
      handleErrorNotification(error, "Failed to add items to collection");
    },
  });
}
