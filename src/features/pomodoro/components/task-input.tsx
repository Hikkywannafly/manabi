"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/stores/use-task-store";
import { TaskBoard } from "./task-board";

interface TaskInputProps {
  className?: string;
}

export function TaskInput({ className }: TaskInputProps) {
  const { activeTaskId, tasks } = useTaskStore();
  const activeTask = tasks.find((t) => t.id === activeTaskId);

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

      {/* Task Board Trigger */}
      <TaskBoard>
        <div className="relative w-full max-w-md cursor-pointer">
          <div className="flex gap-2">
            <div
              className={cn(
                "flex h-12 w-full items-center justify-between rounded-md border border-white/10 bg-black/20 px-4 text-white backdrop-blur-sm transition-all hover:bg-black/30",
              )}
            >
              <span className="text-white/50">
                {activeTask ? "Manage tasks..." : "What are you working on?"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white/50 hover:text-white"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TaskBoard>
    </div>
  );
}
