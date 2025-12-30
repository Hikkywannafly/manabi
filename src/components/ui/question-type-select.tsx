"use client";

import { ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface QuestionTypeOption {
  value: string;
  label: string;
}

export const QUESTION_TYPES: QuestionTypeOption[] = [
  { value: "mixed", label: "Mixed" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True/False" },
  { value: "fill_in_blank", label: "Fill in Blank" },
  { value: "short_answer", label: "Short Answer" },
];

interface QuestionTypeMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function QuestionTypeMultiSelect({
  value,
  onChange,
  className,
}: QuestionTypeMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (triggerRef.current) {
        setWidth(triggerRef.current.offsetWidth);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get display text
  const getDisplayText = () => {
    if (value.includes("mixed") || value.length === 0) {
      return "Mixed";
    }
    if (value.length === 1) {
      const type = QUESTION_TYPES.find((t) => t.value === value[0]);
      return type?.label ?? "Select types";
    }
    return `${value.length} types selected`;
  };

  // Handle selection
  const handleSelect = (selectedValue: string) => {
    if (selectedValue === "mixed") {
      // Selecting mixed clears all others
      onChange(["mixed"]);
    } else {
      // Remove mixed if it was selected
      const currentValues = value.filter((v) => v !== "mixed");

      if (currentValues.includes(selectedValue)) {
        // Deselect
        const newValues = currentValues.filter((v) => v !== selectedValue);
        // If nothing left, default to mixed
        onChange(newValues.length === 0 ? ["mixed"] : newValues);
      } else {
        // Select
        onChange([...currentValues, selectedValue]);
      }
    }
  };

  const isChecked = (optionValue: string) => {
    if (optionValue === "mixed") {
      return value.includes("mixed") || value.length === 0;
    }
    return value.includes(optionValue);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-secondary font-normal",
            className,
          )}
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full"
        style={{ width: `${width}px` }}
        align="start"
      >
        {QUESTION_TYPES.map((type) => (
          <DropdownMenuCheckboxItem
            key={type.value}
            checked={isChecked(type.value)}
            onCheckedChange={() => handleSelect(type.value)}
            onSelect={(e) => e.preventDefault()}
          >
            {type.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
