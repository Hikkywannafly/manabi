"use client";

import { StickyNote } from "lucide-react";
import { useNoteStore } from "@/stores/use-note-store";

export function NotesButton() {
  const { setIsOpen } = useNoteStore();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="notes-toolbar-button flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1.5 rounded-lg bg-black/20 px-2 transition-all hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3"
      aria-label="Open notes panel"
      title="Open notes"
    >
      <StickyNote className="h-5 w-5 text-white sm:h-5 sm:w-5" />
    </button>
  );
}
