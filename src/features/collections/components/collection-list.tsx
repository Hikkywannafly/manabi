"use client";

import type { Collection } from "../types";
import { CollectionCard } from "./collection-card";
import { CreateCollectionCard } from "./create-collection-card";

interface CollectionListProps {
  collections: Collection[];
}

export function CollectionList({ collections }: CollectionListProps) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CreateCollectionCard />
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
