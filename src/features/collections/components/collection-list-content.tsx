"use client";

import { useCollections } from "../hooks/use-collections";
import { CollectionList } from "./collection-list";

export function CollectionListContent() {
  const { data: collections = [], isLoading, isError } = useCollections();

  if (isLoading) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-destructive">
        <p>Failed to load collections. Please try again.</p>
      </div>
    );
  }

  return <CollectionList collections={collections} />;
}
