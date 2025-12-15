"use client";

import { Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  tags: string[];
  createdAt: string;
}

interface FlashcardItemProps {
  flashcard: Flashcard;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export function FlashcardItem({
  flashcard,
  onView,
  onEdit,
}: FlashcardItemProps) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-xl" title={flashcard.term}>
            {flashcard.term}
          </CardTitle>
          {flashcard.tags.length > 0 && (
            <Badge variant="secondary" className="shrink-0">
              {flashcard.tags[0]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-muted-foreground text-sm">
          {flashcard.definition}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(flashcard.id)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onEdit(flashcard.id)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
