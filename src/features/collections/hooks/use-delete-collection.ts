import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { handleErrorNotification } from "@/lib/notifications";
import { CollectionService } from "../services/collection-service";

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      if (!user?.id) throw new Error("User not found");
      return CollectionService.deleteCollection(collectionId, user.id);
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
