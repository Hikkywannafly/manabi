"use client";

import { Plus, Search, StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotes } from "../hooks/use-notes";
import { NoteCard } from "./note-card";
import { NoteEditor } from "./note-editor";

export function NoteList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { notes, isLoading, createNote } = useNotes();

  const handleAddNote = async () => {
    try {
      const newNote = await createNote({});
      if (newNote?.id) {
        router.push(`/dashboard/notes/${newNote.id}`);
      }
    } catch (error) {
      console.error("Failed to create note", error);
    }
  };

  const filteredNotes = notes.filter((n) => {
    // 1. Tab Filter
    const isCornell = !!(n.cue?.trim() || n.summary?.trim());
    if (activeTab === "notes" && isCornell) return false;
    if (activeTab === "cornell" && !isCornell) return false;

    // 2. Search Filter
    const term = search.toLowerCase();
    if (!term) return true;

    const titleMatch = n.title?.toLowerCase().includes(term);
    const contentMatch = n.content?.toLowerCase().includes(term);
    const cueMatch = n.cue?.toLowerCase().includes(term);
    const summaryMatch = n.summary?.toLowerCase().includes(term);

    return titleMatch || contentMatch || cueMatch || summaryMatch;
  });

  const countsActive = {
    all: notes.length,
    notes: notes.filter((n) => !(n.cue?.trim() || n.summary?.trim())).length,
    cornell: notes.filter((n) => n.cue?.trim() || n.summary?.trim()).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">Notes</h1>
        <Button onClick={handleAddNote}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      <div className="space-y-4">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-10 w-full justify-start border-none bg-muted/50 p-1 lg:w-auto">
            <TabsTrigger
              value="all"
              className="px-4 py-1.5 font-semibold text-xs"
            >
              All Notes ({countsActive.all})
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="px-4 py-1.5 font-semibold text-xs"
            >
              Notes ({countsActive.notes})
            </TabsTrigger>
            <TabsTrigger
              value="cornell"
              className="px-4 py-1.5 font-semibold text-xs"
            >
              Cornell Notes ({countsActive.cornell})
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
            <Button variant="outline" onClick={handleAddNote}>
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
