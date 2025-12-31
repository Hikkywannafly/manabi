"use client";

import { Trash } from "lucide-react";
import { RichTextEditor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface AnswerOptionEditorProps {
  option: { id: string; text: string };
  isCorrect: boolean;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

import { memo, useCallback } from "react";

// ... existing imports ...

// ... props ...

export const AnswerOptionEditor = memo(function AnswerOptionEditor({
  option,
  onUpdate,
  onDelete,
}: AnswerOptionEditorProps) {
  const handleUpdate = useCallback(
    (text: string) => {
      onUpdate(option.id, text);
    },
    [option.id, onUpdate],
  );

  const handleDelete = useCallback(() => {
    onDelete(option.id);
  }, [option.id, onDelete]);

  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem
        value={option.id}
        id={option.id}
        aria-label={`Select ${option.text || "answer"} as correct`}
        className="size-4 shrink-0 border-input ring-2 ring-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
      <RichTextEditor
        content={option.text}
        onUpdate={handleUpdate}
        placeholder="Enter answer option..."
        className="flex-1 rounded-md border border-input bg-tertiary"
      />
      <Button
        variant="ghost"
        className="ml-1 h-9 w-max shrink-0 rounded-2xl p-0 text-red-500 hover:bg-accent hover:text-red-500"
        onClick={handleDelete}
      >
        <Trash className="size-4" />
      </Button>
    </div>
  );
});
