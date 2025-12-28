import { create } from "zustand";

/**
 * Note UI State Store
 * Only manages UI-related state (dialog open/close, selected note)
 * Data fetching is handled by useNotes hook with React Query
 */
interface NoteUIState {
  isOpen: boolean;
  selectedNoteId: string | null;

  // Actions
  setIsOpen: (open: boolean) => void;
  setSelectedNoteId: (id: string | null) => void;
}

export const useNoteStore = create<NoteUIState>((set) => ({
  isOpen: false,
  selectedNoteId: null,

  setIsOpen: (open) => set({ isOpen: open }),
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
}));
