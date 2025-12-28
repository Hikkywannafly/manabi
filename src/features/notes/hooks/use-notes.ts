"use client";

import { useEffect } from "react";
import { useNoteStore } from "@/stores/use-note-store";

export function useNotes() {
  const {
    notes,
    isLoading,
    selectedNoteId,
    isOpen,
    setIsOpen,
    setSelectedNoteId,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
  } = useNoteStore();

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    isLoading,
    selectedNote,
    selectedNoteId,
    isOpen,
    setIsOpen,
    setSelectedNoteId,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
  };
}
