"use client";

import { Plus, Search, StickyNote, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/features/notes/components/editor/rich-text-editor";
import { useNotes } from "@/features/notes/hooks/use-notes";
import type { Note } from "@/features/notes/services/note-service";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/stores/use-note-store";

interface NoteSidebarCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

function NoteSidebarCard({ note, isActive, onClick }: NoteSidebarCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group mb-3 flex w-full cursor-pointer flex-col gap-1 rounded-xl border p-4 text-left outline-none transition-all duration-200 focus-visible:ring-1 focus-visible:ring-white/20",
        isActive
          ? "scale-[1.02] border-white/20 bg-white/10 shadow-xl"
          : "border-transparent opacity-60 hover:bg-white/5 hover:opacity-100",
      )}
    >
      <div className="flex items-center justify-between">
        <h4
          className={cn(
            "line-clamp-1 font-black text-sm tracking-tight",
            isActive ? "text-white" : "text-white/80",
          )}
        >
          {note.title || "Untitled Note"}
        </h4>
        {note.is_pinned && (
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-[10px] text-white/30 uppercase tracking-tighter">
          {new Date(note.updated_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <p className="line-clamp-1 flex-1 text-[11px] text-white/40 italic">
          {note.content?.replace(/<[^>]*>/g, "").substring(0, 30) ||
            "No content..."}
        </p>
      </div>
    </button>
  );
}

interface NoteEditorContentProps {
  note: Note;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
}

function NoteEditorContent({ note, updateNote }: NoteEditorContentProps) {
  const [content, setContent] = useState(note.content || "");
  const [_isSaving, setIsSaving] = useState(false);

  const debouncedContent = useDebounce(content, 1000);

  useEffect(() => {
    const hasChanged = debouncedContent !== (note.content || "");

    if (hasChanged) {
      const save = async () => {
        setIsSaving(true);
        try {
          await updateNote(note.id, {
            content: debouncedContent,
          });
          setTimeout(() => setIsSaving(false), 800);
        } catch (error) {
          console.error("Save failed", error);
          setIsSaving(false);
        }
      };
      save();
    }
  }, [debouncedContent, note.id, note.content, updateNote]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <RichTextEditor content={content} onChange={setContent} />
    </div>
  );
}

export function NotesPanel() {
  // UI State from Zustand
  const { isOpen, setIsOpen, selectedNoteId, setSelectedNoteId } =
    useNoteStore();

  // Data from React Query
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");

  // Auto-select first note when dialog opens
  useEffect(() => {
    if (isOpen && !selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [isOpen, selectedNoteId, notes, setSelectedNoteId]);

  const filteredNotes = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: "",
        content: "",
        is_pinned: true,
      });
      setSelectedNoteId(newNote.id);
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="!max-w-[1400px] h-[90vh] w-[90vw] overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-0 text-white">
        <DialogTitle className="sr-only">Notes Management Panel</DialogTitle>
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar */}
          <div className="flex min-w-[320px] max-w-[320px] flex-col border-white/10 border-r bg-white/[0.02]">
            {/* Sidebar Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-white/10 border-b px-6">
              <div className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-white/70" />
                <h2 className="font-semibold text-white text-xl">Notes</h2>
                <span className="text-sm text-white/50">
                  ({isLoading ? "..." : notes.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* New Note Button */}
            <div className="shrink-0 px-6 pt-6">
              <Button
                onClick={handleCreateNote}
                disabled={isLoading}
                className="h-11 w-full gap-2 rounded-xl bg-white font-black text-black text-xs uppercase tracking-widest shadow-lg hover:bg-white/90 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                New Note
              </Button>
            </div>

            {/* Search */}
            <div className="shrink-0 px-6 py-4">
              <div className="group relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-white/20 transition-colors group-focus-within:text-white" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-xl border-white/[0.05] bg-white/[0.03] pl-10 text-sm focus-visible:ring-white/10"
                />
              </div>
            </div>

            {/* Notes List */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                  <p className="font-bold text-xs uppercase tracking-widest">
                    Loading...
                  </p>
                </div>
              ) : filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <NoteSidebarCard
                    key={note.id}
                    note={note}
                    isActive={selectedNoteId === note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                  <Search className="mb-4 h-10 w-10" />
                  <p className="font-bold text-xs uppercase tracking-widest">
                    No entries
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="relative flex min-w-0 flex-1 flex-col bg-black/20">
            {selectedNote ? (
              <>
                {/* Content Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-white/10 border-b px-8">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <Input
                      value={selectedNote.title || ""}
                      onChange={(e) => {
                        updateNote(selectedNote.id, { title: e.target.value });
                      }}
                      placeholder="Untitled Note"
                      className="h-auto border-none bg-transparent p-0 font-black text-2xl text-white tracking-tight placeholder:text-white/20 focus-visible:ring-0"
                    />
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Editor */}
                <div className="min-h-0 flex-1 overflow-y-auto p-8">
                  <NoteEditorContent
                    key={selectedNote.id}
                    note={selectedNote}
                    updateNote={updateNote}
                  />
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                <button
                  type="button"
                  className="group relative mb-10 cursor-pointer outline-none"
                  onClick={handleCreateNote}
                >
                  <div className="absolute inset-0 rounded-full bg-primary/30 blur-[80px] transition-all duration-500 group-hover:bg-primary/50" />
                  <div className="relative rounded-[3rem] border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md transition-transform group-hover:scale-110">
                    <StickyNote className="h-20 w-20 text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                  </div>
                </button>
                <h3 className="mb-3 font-black text-3xl text-white tracking-tight">
                  Ready to focus?
                </h3>
                <p className="mb-10 max-w-sm font-medium text-white/30 leading-relaxed">
                  Capture your insights instantly while you work. Choose a note
                  from the sidebar or start a fresh one.
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleCreateNote}
                    disabled={isLoading}
                    className="h-14 rounded-2xl bg-white px-10 font-black text-black text-xs uppercase tracking-widest shadow-2xl hover:bg-white/90 disabled:opacity-50"
                  >
                    Quick Create
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
