import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { handleErrorNotification } from "@/lib/notifications";
import { CollectionService } from "../services/collection-service";

export function useRemoveItemFromCollection() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      itemId,
      itemType,
    }: {
      itemId: string;
      itemType: "quiz" | "deck";
    }) => {
      if (!user?.id) throw new Error("User not found");
      return CollectionService.removeItemFromCollection(
        itemId,
        itemType,
        user.id,
      );
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
