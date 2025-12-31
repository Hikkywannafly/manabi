import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { handleErrorNotification } from "@/lib/notifications";
import { CollectionService } from "../services/collection-service";

export function useCreateCollection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      isPublic,
    }: {
      name: string;
      isPublic: boolean;
    }) => {
      if (!user) throw new Error("User not authenticated");
      return CollectionService.createCollection(user.id, name, isPublic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection created successfully!");
    },
    onError: (error) => {
      handleErrorNotification(error, "Failed to create collection");
    },
  });
}
