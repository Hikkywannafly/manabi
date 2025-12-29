"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardPage } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { CornellEditor } from "@/features/notes/components/cornell-editor";
import { useNotes } from "@/features/notes/hooks/use-notes";

export default function NoteDetailPage() {
  const { id } = useParams();
  const { notes, isLoading, updateNote } = useNotes();
  const note = notes.find((n) => n.id === id);

  if (isLoading) {
    return (
      <DashboardPage title="Loading note...">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardPage>
    );
  }

  if (!note) {
    return (
      <DashboardPage title="Note not found">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-muted-foreground">
            The note you're looking for doesn't exist.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard/notes">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Notes
            </Link>
          </Button>
        </div>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage
      headerAction={
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/notes">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
      }
    >
      <CornellEditor note={note} updateNote={updateNote} />
    </DashboardPage>
  );
}
