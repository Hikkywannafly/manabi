"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useNoteStore } from "@/stores/use-note-store";
import { useNotes } from "../hooks/use-notes";
import { RichTextEditor } from "./editor/rich-text-editor";

interface NoteEditorContentProps {
  note: any;
  updateNote: (id: string, updates: any) => Promise<void>;
  setIsOpen: (open: boolean) => void;
}

function NoteEditorContent({
  note,
  updateNote,
  setIsOpen,
}: NoteEditorContentProps) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [isSaving, setIsSaving] = useState(false);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // Auto-save effect
  useEffect(() => {
    const hasChanged =
      debouncedTitle !== (note.title || "") ||
      debouncedContent !== (note.content || "");

    if (hasChanged) {
      const save = async () => {
        setIsSaving(true);
        try {
          await updateNote(note.id, {
            title: debouncedTitle,
            content: debouncedContent,
          });
          // Small delay for UX
          setTimeout(() => setIsSaving(false), 800);
        } catch (error) {
          console.error("Save failed", error);
          setIsSaving(false);
        }
      };
      save();
    }
  }, [
    debouncedTitle,
    debouncedContent,
    note.id,
    note.title,
    note.content,
    updateNote,
  ]);

  return (
    <>
      <DialogHeader className="sticky top-0 z-20 border-b bg-background/80 px-10 pt-10 pb-4 backdrop-blur-sm">
        <DialogTitle className="sr-only">Edit Note</DialogTitle>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="h-auto flex-1 border-none bg-transparent px-0 py-2 font-black text-4xl tracking-tight placeholder:text-muted-foreground/20 focus-visible:ring-0"
            />
            <div className="ml-4 flex items-center gap-3 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 transition-all duration-300">
              {isSaving ? (
                <span className="flex animate-pulse items-center gap-2 font-bold text-[10px] text-primary uppercase tracking-widest">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Saving
                </span>
              ) : (
                <span className="flex items-center gap-2 font-bold text-[10px] text-emerald-500 uppercase tracking-widest">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-hidden bg-background">
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-3 text-[11px] text-muted-foreground uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>
            {note?.updated_at
              ? `Last edited: ${new Date(note.updated_at).toLocaleString()}`
              : ""}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-7 px-2 text-[10px]"
        >
          Close
        </Button>
      </div>
    </>
  );
}

export function NoteEditor() {
  // UI State from Zustand
  const { selectedNoteId, isOpen, setIsOpen } = useNoteStore();

  // Data from React Query
  const { notes, updateNote } = useNotes();

  const note = notes.find((n) => n.id === selectedNoteId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex h-[92vh] max-w-6xl flex-col overflow-hidden rounded-2xl border-none bg-background p-0 shadow-3xl">
        {note ? (
          <NoteEditorContent
            key={note.id}
            note={note}
            updateNote={updateNote}
            setIsOpen={setIsOpen}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
