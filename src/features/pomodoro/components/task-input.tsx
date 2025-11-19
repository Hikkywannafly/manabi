"use client";

import { ChevronDown, Flag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TASK_TAGS } from "../types";

interface TaskInputProps {
  className?: string;
}

export function TaskInput({ className }: TaskInputProps) {
  const [task, setTask] = useState("");
  const [selectedTag, setSelectedTag] = useState(TASK_TAGS[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Tag Selector */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto bg-black/30 px-4 py-2 font-light text-sm backdrop-blur-sm hover:bg-black/40"
          >
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-sm"
                style={{ backgroundColor: selectedTag.color }}
              />
              <span className="font-medium text-white">{selectedTag.name}</span>
            </div>
            <ChevronDown className="ml-2 size-4 text-white/50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="center">
          <div className="flex flex-col gap-1">
            {TASK_TAGS.map((tag: any) => (
              <button
                key={tag.name}
                type="button"
                onClick={() => {
                  setSelectedTag(tag);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  "hover:bg-accent",
                  selectedTag.name === tag.name && "bg-accent",
                )}
              >
                <div
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: tag.color }}
                />
                <span>{tag.name}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Task Input */}
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          placeholder="What are you working on?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className={cn(
            "h-12 border-white/10 bg-black/20 text-white backdrop-blur-sm placeholder:text-white/50",
            "focus:border-white/30 focus:ring-white/20",
            "text-center text-base sm:text-lg",
          )}
        />
      </div>

      {/* Goal Display (Optional) */}
      {task && (
        <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-1.5 backdrop-blur-sm">
          <Flag className="size-4 text-white/70" />
          <span className="text-sm text-white/70">{task}</span>
        </div>
      )}
    </div>
  );
}
