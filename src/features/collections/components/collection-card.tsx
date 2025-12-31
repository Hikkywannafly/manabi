"use client";

import { BookCopy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Collection } from "../types";
import { CollectionMenu } from "./collection-menu";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Menu Button */}
      <div className="absolute top-2 right-2 z-10">
        <CollectionMenu collection={collection} />
      </div>

      {/* Gradient Header */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(221_83%_63%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] opacity-10" />
        <div className="rounded-full p-4 backdrop-blur-sm">
          <BookCopy className="size-10 text-white" />
        </div>
      </div>

      {/* Collection Name */}
      <div className="flex grow flex-col items-center p-6 pt-4">
        <p className="w-full truncate px-4 text-center font-semibold text-lg">
          {collection.name}
        </p>
      </div>

      {/* View Button */}
      <div className="mt-auto flex items-center p-4">
        <Link
          className="w-full"
          href={`/dashboard/collections/${collection.id}`}
        >
          <Button
            variant="secondary"
            className="w-full rounded-2xl"
            size="default"
          >
            View Collection
          </Button>
        </Link>
      </div>
    </div>
  );
}
