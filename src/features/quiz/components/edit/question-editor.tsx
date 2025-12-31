"use client";

import { ArrowRightLeft, GripVertical, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { RichTextEditor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import type { QuizQuestion } from "../../types";
import { AnswerOptionEditor } from "./answer-option-editor";

interface QuestionEditorProps {
  question: QuizQuestion;
  index: number;
  onUpdate: (id: string, updates: Partial<QuizQuestion>) => void;
  onDelete: (id: string) => void;
}

import { memo, useCallback, useRef } from "react";

// Helper hook for debouncing
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
) {
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      const later = () => {
        clearTimeout(timeout.current);
        callback(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [callback, wait],
  );
}

export const QuestionEditor = memo(function QuestionEditor({
  question,
  onUpdate,
  onDelete,
}: QuestionEditorProps) {
  const [options, setOptions] = useState<Array<{ id: string; text: string }>>(
    () => {
      try {
        const parsed =
          typeof question.options === "string"
            ? JSON.parse(question.options)
            : question.options;

        if (Array.isArray(parsed)) {
          if (typeof parsed[0] === "string") {
            return parsed.map((text, idx) => ({ id: `option-${idx}`, text }));
          }
          return parsed;
        }
        return [];
      } catch {
        return [];
      }
    },
  );

  // Wrapper for parent update to ensure we don't need to pass ID everywhere locally
  const handleParentUpdate = useCallback(
    (updates: Partial<QuizQuestion>) => {
      onUpdate(question.id, updates);
    },
    [question.id, onUpdate],
  );

  // Debounced update to parent
  const debouncedOnUpdate = useDebouncedCallback(handleParentUpdate, 500);

  const handleQuestionTextUpdate = useCallback(
    (text: string) => {
      debouncedOnUpdate({ question_text: text });
    },
    [debouncedOnUpdate],
  );

  const handleOptionUpdate = useCallback(
    (optionId: string, text: string) => {
      setOptions((current) => {
        const updated = current.map((opt) =>
          opt.id === optionId ? { ...opt, text } : opt,
        );
        debouncedOnUpdate({ options: JSON.stringify(updated) });
        return updated;
      });
    },
    [debouncedOnUpdate],
  );

  const handleDeleteOption = useCallback(
    (optionId: string) => {
      setOptions((current) => {
        const updated = current.filter((opt) => opt.id !== optionId);
        handleParentUpdate({ options: JSON.stringify(updated) }); // Delete should be immediate
        return updated;
      });
    },
    [handleParentUpdate],
  );

  const handleAddOption = () => {
    setOptions((current) => {
      const newOption = { id: `option-${current.length}`, text: "" };
      const updated = [...current, newOption];
      // onUpdate({ options: JSON.stringify(updated) }); // Immediate
      // Actually, standard setState pattern
      debouncedOnUpdate({ options: JSON.stringify(updated) });
      return updated;
    });
  };

  const handleCorrectAnswerChange = (value: string) => {
    handleParentUpdate({ correct_answer: value });
  };

  return (
    <div className="mt-8 rounded-xl bg-secondary/50 p-4 md:p-6">
      {/* Question Text */}
      <div className="mb-4 flex items-center gap-2">
        <GripVertical className="size-6 shrink-0 cursor-move text-muted-foreground" />
        <RichTextEditor
          content={question.question_text || ""}
          onUpdate={handleQuestionTextUpdate}
          placeholder="Enter question text..."
          className="flex-1 rounded-md border border-input bg-background"
        />
      </div>

      {/* Answer Options */}
      <div className="mt-4">
        <RadioGroup
          value={question.correct_answer}
          onValueChange={handleCorrectAnswerChange}
          className="grid shrink-0 gap-2"
        >
          {options.map((option: any) => (
            <AnswerOptionEditor
              key={option.id}
              option={option}
              isCorrect={question.correct_answer === option.id}
              onUpdate={handleOptionUpdate}
              onDelete={handleDeleteOption}
            />
          ))}
        </RadioGroup>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full flex-wrap items-center justify-end gap-2 pt-4">
        <Button
          variant="outline"
          className="h-9 shrink-0 whitespace-nowrap rounded-2xl px-3"
          type="button"
        >
          <ArrowRightLeft className="mr-2 size-4" />
          Free Response
        </Button>

        <Button
          variant="secondary"
          className="h-9 shrink-0 rounded-2xl bg-tertiary px-3 text-tertiary-foreground hover:bg-tertiary/80"
          type="button"
          onClick={handleAddOption}
        >
          <Plus className="mr-2 size-4" />
          Add Answer
        </Button>

        <Button
          variant="ghost"
          className="h-9 shrink-0 rounded-2xl p-2 text-red-500 hover:bg-accent hover:text-red-500"
          type="button"
          onClick={() => onDelete(question.id)}
        >
          <Trash className="size-4" />
        </Button>
      </div>
    </div>
  );
});
