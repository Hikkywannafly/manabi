"use client";

import { StickyNote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecentNotesWidgetProps {
  notes: any[]; // using simple types for now
}

export function RecentNotesWidget({ notes }: RecentNotesWidgetProps) {
  return (
    <div className="mb-4">
      <div className="overflow-hidden rounded-lg border bg-secondary text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="flex items-center justify-between font-semibold text-lg leading-none tracking-tight">
            <span className="flex items-center gap-2">
              <StickyNote className="size-5" />
              Recent Notes
            </span>
            <Link href="/dashboard/notes">
              <Button size="sm" className="h-9 rounded-2xl px-3 text-sm">
                Create Note
              </Button>
            </Link>
          </h3>
        </div>
        <div className="p-6 pt-0">
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No notes yet. Create one to organize your study materials!
            </p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li key={note.id} className="truncate text-sm">
                  {note.title || "Untitled Note"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
