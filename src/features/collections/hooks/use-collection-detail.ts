import { useQuery } from "@tanstack/react-query";
import { CollectionService } from "../services/collection-service";

export function useCollectionDetail(collectionId: string) {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => CollectionService.getCollectionDetail(collectionId),
    enabled: !!collectionId,
  });
}
