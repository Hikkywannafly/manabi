import { create } from "zustand";
import { type Note, noteService } from "@/features/notes/services/note-service";

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  selectedNoteId: string | null;
  isOpen: boolean;

  // Actions
  setIsOpen: (open: boolean) => void;
  setSelectedNoteId: (id: string | null) => void;
  fetchNotes: () => Promise<void>;
  addNote: (title?: string, content?: string) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  selectedNoteId: null,
  isOpen: false,

  setIsOpen: (open) => set({ isOpen: open }),
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const notes = await noteService.getNotes();
      set({ notes, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      set({ isLoading: false });
    }
  },

  addNote: async (title, content) => {
    try {
      const newNote = await noteService.createNote({ title, content });
      set((state) => ({
        notes: [newNote, ...state.notes],
        selectedNoteId: newNote.id,
        isOpen: true,
      }));
      return newNote;
    } catch (error: any) {
      console.error("Failed to add note:", error.message || error);
      throw error;
    }
  },

  updateNote: async (id, updates) => {
    // Optimistic update
    const previousNotes = get().notes;
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));

    try {
      await noteService.updateNote(id, updates);
    } catch (error) {
      console.error("Failed to update note:", error);
      set({ notes: previousNotes });
      throw error;
    }
  },

  deleteNote: async (id) => {
    const previousNotes = get().notes;
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
    }));

    try {
      await noteService.deleteNote(id);
    } catch (error) {
      console.error("Failed to delete note:", error);
      set({ notes: previousNotes });
      throw error;
    }
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;

    const newPinnedStatus = !note.is_pinned;

    // Sort notes after pinning toggle to keep pinned notes at top
    const previousNotes = get().notes;
    const updatedNotes = previousNotes
      .map((n) => (n.id === id ? { ...n, is_pinned: newPinnedStatus } : n))
      .sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });

    set({ notes: updatedNotes });

    try {
      await noteService.togglePin(id, newPinnedStatus);
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      set({ notes: previousNotes });
      throw error;
    }
  },
}));
