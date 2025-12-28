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
import { RichTextEditor } from "./editor/rich-text-editor";

export function NoteEditor() {
  const { notes, selectedNoteId, isOpen, setIsOpen, updateNote } =
    useNoteStore();
  const note = notes.find((n) => n.id === selectedNoteId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  useEffect(() => {
    if (
      note &&
      (debouncedTitle !== (note.title || "") ||
        debouncedContent !== (note.content || ""))
    ) {
      const save = async () => {
        setIsSaving(true);
        try {
          await updateNote(note.id, {
            title: debouncedTitle,
            content: debouncedContent,
          });
          // Give a small delay for visibility
          setTimeout(() => setIsSaving(false), 800);
        } catch (error) {
          console.error("Save failed", error);
          setIsSaving(false);
        }
      };
      save();
    }
  }, [debouncedTitle, debouncedContent, note, updateNote]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex h-[92vh] max-w-6xl flex-col overflow-hidden rounded-2xl border-none bg-background p-0 shadow-3xl">
        <DialogHeader className="sticky top-0 z-20 border-b bg-background/80 px-5 pt-6 pb-4 backdrop-blur-sm">
          <DialogTitle className="sr-only">Edit Note</DialogTitle>
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-between">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="h-auto w-full border-none bg-transparent px-1 py-2 font-bold text-foreground text-xl tracking-tight transition-colors placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 md:text-2xl lg:text-3xl"
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
      </DialogContent>
    </Dialog>
  );
}
