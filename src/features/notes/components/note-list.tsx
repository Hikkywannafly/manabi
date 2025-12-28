"use client";

import { Plus, Search, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNoteStore } from "@/stores/use-note-store";
import { NoteCard } from "./note-card";
import { NoteEditor } from "./note-editor";

export function NoteList() {
  const [search, setSearch] = useState("");
  const { notes, isLoading, fetchNotes, addNote } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">Notes</h1>
        <Button onClick={() => addNote()}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="fade-in-50 flex min-h-[300px] animate-in flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <StickyNote className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">No notes found</h3>
          <p className="mt-2 mb-4 text-sm">
            {search
              ? "Try adjusting your search terms."
              : "Start capturing your thoughts and ideas today."}
          </p>
          {!search && (
            <Button variant="outline" onClick={() => addNote()}>
              Create your first note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <NoteEditor />
    </div>
  );
}
