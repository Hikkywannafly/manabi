"use client";

import { ChevronDown, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface FlashcardFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function FlashcardFilter({
  search,
  onSearchChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: FlashcardFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
        <Input
          className="bg-secondary pl-9"
          placeholder="Search flashcards..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[180px] justify-between border-input bg-secondary"
            >
              <span>
                {sort === "newest"
                  ? "Most Recent"
                  : sort === "oldest"
                    ? "Oldest"
                    : sort === "az"
                      ? "A-Z"
                      : "Z-A"}
              </span>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={() => onSortChange("newest")}>
              Most Recent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("oldest")}>
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("az")}>
              A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("za")}>
              Z-A
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-1">
          <Button
            size="icon"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            className="size-10 rounded-2xl"
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "list" ? "secondary" : "ghost"}
            className="size-10 rounded-2xl"
            onClick={() => onViewModeChange("list")}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
