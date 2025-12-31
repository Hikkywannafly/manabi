import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { CollectionService } from "../services/collection-service";

export function useCollections() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["collections", user?.id],
    queryFn: () => CollectionService.getCollections(),
    enabled: !!user,
  });
}
