"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, MoreVertical, Pin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/stores/use-note-store";
import { useNotes } from "../hooks/use-notes";
import type { Note } from "../services/note-service";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  // UI State from Zustand
  const { setSelectedNoteId, setIsOpen } = useNoteStore();

  // Data operations from React Query
  const { togglePin, deleteNote } = useNotes();

  const handleEdit = () => {
    setSelectedNoteId(note.id);
    setIsOpen(true);
  };

  return (
    <Card
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden transition-all hover:shadow-md",
        note.is_pinned && "border-primary/50 bg-primary/5",
      )}
      onClick={handleEdit}
    >
      <div className="space-y-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 flex-1 font-semibold text-lg">
            {note.title || "Untitled Note"}
          </h3>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                note.is_pinned && "text-primary opacity-100",
              )}
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note.id, !note.is_pinned);
              }}
            >
              <Pin
                className={cn("h-4 w-4", note.is_pinned && "fill-current")}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="line-clamp-3 min-h-[3rem] text-muted-foreground text-sm">
          {note.content || "No content..."}
        </p>

        <div className="flex items-center pt-2 text-[10px] text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
        </div>
      </div>

      {note.is_pinned && (
        <div className="absolute top-1 right-1 p-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
      )}
    </Card>
  );
}
