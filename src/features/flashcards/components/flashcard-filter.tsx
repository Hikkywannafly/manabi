"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FlashcardFilterProps {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function FlashcardFilter({
  onSearchChange,
  onSortChange,
}: FlashcardFilterProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search flashcards..."
          className="pl-8"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select onValueChange={onSortChange} defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="az">A-Z</SelectItem>
            <SelectItem value="za">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
