"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/stores/use-task-store";
import { TaskList } from "./task-list";

interface TaskInputProps {
  className?: string;
}

export function TaskInput({ className }: TaskInputProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { addTask, activeTaskId, tasks } = useTaskStore();
  const [isListOpen, setIsListOpen] = useState(false);

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle("");
      setIsListOpen(true);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Active Task Display */}
      {activeTask && (
        <div className="fade-in slide-in-from-bottom-2 flex animate-in items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 backdrop-blur-sm">
          <div className="size-2 animate-pulse rounded-full bg-orange-500" />
          <span className="font-medium text-orange-100 text-sm">
            Focusing on: {activeTask.title}
          </span>
        </div>
      )}

      {/* Task Input & List Toggle */}
      <div className="relative w-full max-w-md">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="What are you working on?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "h-12 border-white/10 bg-black/20 text-white backdrop-blur-sm placeholder:text-white/50",
              "focus:border-white/30 focus:ring-white/20",
              "text-base sm:text-lg",
            )}
          />
          <Popover open={isListOpen} onOpenChange={setIsListOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 border-white/10 bg-black/20 text-white hover:bg-black/40 hover:text-white"
              >
                <span className="mr-2 hidden sm:inline">Tasks</span>
                <ChevronDown className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[350px] border-white/10 bg-black/80 p-4 backdrop-blur-xl sm:w-[400px]"
              align="end"
            >
              <TaskList />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
