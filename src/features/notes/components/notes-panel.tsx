"use client";

import { Plus, Search, StickyNote, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/stores/use-note-store";
import { RichTextEditor } from "./editor/rich-text-editor";

interface NoteSidebarCardProps {
  note: any;
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
  note: any;
  updateNote: (id: string, updates: any) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setIsOpen: (open: boolean) => void;
}

function NoteEditorContent({
  note,
  updateNote,
  deleteNote,
}: NoteEditorContentProps) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [isSaving, setIsSaving] = useState(false);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

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
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between px-10 py-6">
        <div className="flex flex-1 items-center gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edit title..."
            className="h-auto border-none bg-transparent p-0 font-black text-4xl text-white tracking-tighter placeholder:text-white/10 focus-visible:ring-0"
          />
        </div>

        <div className="ml-4 flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-md">
            {isSaving ? (
              <span className="animate-pulse font-black text-[10px] text-primary uppercase tracking-widest">
                Saving
              </span>
            ) : (
              <span className="font-black text-[10px] text-emerald-500 uppercase tracking-widest">
                Synched
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300 active:scale-90"
            onClick={() => deleteNote(note.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-2">
        <RichTextEditor content={content} onChange={setContent} />
      </div>
    </div>
  );
}

export function NotesPanel() {
  const {
    notes,
    selectedNoteId,
    isOpen,
    setIsOpen,
    updateNote,
    setSelectedNoteId,
    addNote,
    deleteNote,
    fetchNotes,
  } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen, fetchNotes]);

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-[90vh] w-[1800px] max-w-[98vw] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/90 p-0 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <DialogTitle className="sr-only">Notes Management Panel</DialogTitle>
        <div className="flex h-full">
          <div className="flex min-w-[320px] max-w-[450px] flex-[1] flex-col border-white/5 border-r bg-white/[0.02]">
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-black text-2xl text-white italic tracking-tighter">
                  Notes{" "}
                  <span className="ml-1 text-base text-white/50">
                    ({notes.length})
                  </span>
                </h2>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/20 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <Button
                  onClick={() => addNote(undefined, undefined, true)}
                  className="h-11 flex-1 gap-2 rounded-xl bg-white font-black text-black text-xs uppercase tracking-widest shadow-lg shadow-white/5 hover:bg-white/90"
                >
                  <Plus className="h-4 w-4" />
                  New Note
                </Button>
              </div>

              <div className="group relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-white/20 transition-colors group-focus-within:text-white" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 rounded-xl border-white/[0.05] bg-white/[0.03] pl-10 text-sm focus-visible:ring-white/10"
                />
              </div>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto px-6 pb-8">
              {filteredNotes.length > 0 ? (
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

          <div className="relative flex-[3] bg-black/20">
            {selectedNote ? (
              <NoteEditorContent
                key={selectedNote.id}
                note={selectedNote}
                updateNote={updateNote}
                deleteNote={deleteNote}
                setIsOpen={setIsOpen}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                <button
                  type="button"
                  className="group relative mb-10 cursor-pointer outline-none"
                  onClick={() => addNote(undefined, undefined, true)}
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
                    onClick={() => addNote(undefined, undefined, true)}
                    className="h-14 rounded-2xl bg-white px-10 font-black text-black text-xs uppercase tracking-widest shadow-2xl hover:bg-white/90"
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
