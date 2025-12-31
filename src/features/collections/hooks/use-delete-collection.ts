import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleErrorNotification } from "@/lib/notifications";
import { CollectionService } from "../services/collection-service";

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      return CollectionService.deleteCollection(collectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      toast.success("Collection deleted successfully!");
    },
    onError: (error) => {
      handleErrorNotification(error, "Failed to delete collection");
    },
  });
}
