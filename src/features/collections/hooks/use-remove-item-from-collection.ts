import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleErrorNotification } from "@/lib/notifications";
import { CollectionService } from "../services/collection-service";

export function useRemoveItemFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      itemType,
    }: {
      itemId: string;
      itemType: "quiz" | "deck";
    }) => {
      return CollectionService.removeItemFromCollection(itemId, itemType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      toast.success("Item removed from collection!");
    },
    onError: (error) => {
      handleErrorNotification(error, "Failed to remove item from collection");
    },
  });
}
