"use client";

import { Check, GripVertical, MoreVertical, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTasks } from "../hooks";

export function TaskList() {
  const {
    tasks,
    todoTasks,
    doneTasks,
    activeTaskId,
    isLoading,
    fetchTasks,
    updateTaskStatus,
    deleteTask,
    setActiveTask,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading && tasks.length === 0) {
    // Use a skeleton or just return null to avoid layout shift/flicker
    return null;
  }

  if (tasks.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-center">
        <p className="text-lg text-white/50">No tasks yet</p>
        <p className="text-white/30 text-xs">Add a task below to get focused</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {todoTasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:bg-white/5",
            activeTaskId === task.id && "bg-white/5",
          )}
        >
          {/* Drag Handle (Visual only for now) */}
          <div className="cursor-grab text-white/20 opacity-0 transition-opacity hover:text-white group-hover:opacity-100">
            <GripVertical className="size-4" />
          </div>

          {/* Checkbox */}
          <button
            type="button"
            onClick={() => updateTaskStatus(task.id, "DONE")}
            className="flex size-5 items-center justify-center rounded-md border border-white/30 text-transparent transition-colors hover:border-white hover:text-white/50"
          >
            {/* Empty square */}
          </button>

          {/* Task Content */}
          <button
            type="button"
            className="flex-1 cursor-pointer text-left"
            onClick={() => setActiveTask(task.id)}
          >
            <span
              className={cn(
                "font-medium text-white transition-colors",
                activeTaskId === task.id ? "text-orange-400" : "",
              )}
            >
              {task.title}
            </span>
          </button>

          {/* Actions */}
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-white/30 hover:text-white"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-white/10 bg-black/90 text-white backdrop-blur-xl"
              >
                <DropdownMenuItem
                  className="text-red-400 focus:bg-white/10 focus:text-red-400"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      {doneTasks.length > 0 && (
        <div className="pt-4">
          {/* Separator or title if needed, or just list them */}
          {doneTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-xl p-3 opacity-50 transition-opacity hover:opacity-100"
            >
              <div className="w-4" /> {/* Spacer for grip */}
              <button
                type="button"
                onClick={() => updateTaskStatus(task.id, "TODO")}
                className="flex size-5 items-center justify-center rounded-md border border-white/30 bg-white/10 text-white"
              >
                <Check className="size-3" />
              </button>
              <span className="flex-1 text-white line-through">
                {task.title}
              </span>
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-white/30 hover:text-red-400"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
