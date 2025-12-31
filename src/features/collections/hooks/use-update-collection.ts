import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleErrorNotification } from "@/lib/notifications";
import { CollectionService } from "../services/collection-service";

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      name,
    }: {
      collectionId: string;
      name: string;
    }) => {
      return CollectionService.updateCollection(collectionId, name);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({
        queryKey: ["collection", variables.collectionId],
      });
      toast.success("Collection updated successfully!");
    },
    onError: (error) => {
      handleErrorNotification(error, "Failed to update collection");
    },
  });
}
