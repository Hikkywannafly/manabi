"use client";

import { BookOpen, CircleHelp, FileText, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { Note } from "../services/note-service";
import { RichTextEditor } from "./editor/rich-text-editor";

interface CornellEditorProps {
  note: Note;
  updateNote: (id: string, updates: any) => Promise<void>;
}

export function CornellEditor({ note, updateNote }: CornellEditorProps) {
  const [title, setTitle] = useState(note.title || "");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize with fallback for existing JSON content if needed,
  // but prioritize new individual fields
  const [cueContent, setCueContent] = useState(note.cue || "");
  const [notesContent, setNotesContent] = useState(note.content || "");
  const [summaryContent, setSummaryContent] = useState(note.summary || "");

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedCue = useDebounce(cueContent, 1000);
  const debouncedNotes = useDebounce(notesContent, 1000);
  const debouncedSummary = useDebounce(summaryContent, 1000);

  // Auto-save effect
  useEffect(() => {
    const hasChanged =
      debouncedTitle !== (note.title || "") ||
      debouncedCue !== (note.cue || "") ||
      debouncedNotes !== (note.content || "") ||
      debouncedSummary !== (note.summary || "");

    if (hasChanged) {
      const save = async () => {
        setIsSaving(true);
        try {
          await updateNote(note.id, {
            title: debouncedTitle,
            cue: debouncedCue,
            content: debouncedNotes,
            summary: debouncedSummary,
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
    debouncedCue,
    debouncedNotes,
    debouncedSummary,
    note.id,
    note.title,
    note.cue,
    note.content,
    note.summary,
    updateNote,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Title Section - Following note-editor pattern */}
      <div className="flex w-full items-center justify-between">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cornell Note Title"
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

      {/* Cornell Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left Column: Cues */}
        <div className="space-y-3 lg:col-span-1">
          <CornellSectionHeader
            icon={<Lightbulb className="size-4" />}
            label="Cues"
            color="orange"
            tooltip="Keywords, questions, and triggers to help you recall the main notes."
          />
          <div className="overflow-hidden rounded-xl border-2 border-orange-500/20 bg-orange-500/5">
            <RichTextEditor
              content={cueContent}
              onChange={setCueContent}
              placeholder="Key terms, questions, main ideas..."
            />
          </div>
        </div>

        {/* Right Column: Notes */}
        <div className="space-y-3 lg:col-span-3">
          <CornellSectionHeader
            icon={<FileText className="size-4" />}
            label="Notes"
            color="blue"
            tooltip="Detailed notes from the lecture or book. Use shorthand and bullet points."
          />
          <div className="overflow-hidden rounded-xl border-2 border-blue-500/20 bg-blue-500/5">
            <RichTextEditor
              content={notesContent}
              onChange={setNotesContent}
              placeholder="Write detailed notes here..."
            />
          </div>
        </div>

        {/* Bottom Section: Summary */}
        <div className="mt-2 space-y-3 lg:col-span-4">
          <CornellSectionHeader
            icon={<BookOpen className="size-4" />}
            label="Summary"
            color="emerald"
            tooltip="2-3 sentences summarizing the main points of the page."
          />
          <div className="overflow-hidden rounded-xl border-2 border-emerald-500/20 bg-emerald-500/5">
            <RichTextEditor
              content={summaryContent}
              onChange={setSummaryContent}
              placeholder="Summarize key points..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface CornellSectionHeaderProps {
  icon: React.ReactNode;
  label: string;
  color: "orange" | "blue" | "emerald";
  tooltip: string;
}

function CornellSectionHeader({
  icon,
  label,
  color,
  tooltip,
}: CornellSectionHeaderProps) {
  const colorMap = {
    orange: "bg-orange-500 shadow-orange-500/20",
    blue: "bg-blue-500 shadow-blue-500/20",
    emerald: "bg-emerald-500 shadow-emerald-500/20",
  };

  return (
    <div className="flex items-center gap-2.5 px-1">
      <div
        className={cn(
          "flex size-6 items-center justify-center rounded-md text-white shadow-sm",
          colorMap[color],
        )}
      >
        {icon}
      </div>
      <span className="font-bold text-[11px] uppercase tracking-wider opacity-80">
        {label}
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className="size-3.5 cursor-help text-muted-foreground/50 transition-colors hover:text-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px] text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
