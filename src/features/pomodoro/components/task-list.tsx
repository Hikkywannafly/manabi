"use client";

import { CheckCircle2, Circle, MoreVertical, Play, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/stores/use-task-store";

export function TaskList() {
  const {
    tasks,
    activeTaskId,
    isLoading,
    fetchTasks,
    updateTaskStatus,
    deleteTask,
    setActiveTask,
  } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const todoTasks = tasks.filter((t) => t.status !== "done");
  const doneTasks = tasks.filter((t) => t.status === "done");

  if (isLoading && tasks.length === 0) {
    return (
      <div className="text-center text-sm text-white/50">Loading tasks...</div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {todoTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3 transition-all hover:bg-black/30",
                activeTaskId === task.id &&
                  "border-orange-500/50 bg-orange-500/10",
              )}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateTaskStatus(task.id, "done")}
                  className="text-white/50 hover:text-orange-500"
                >
                  <Circle className="size-5" />
                </button>
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-white">
                    {task.title}
                  </span>
                  <span className="text-white/40 text-xs">
                    {task.actual_pomodoros} / {task.estimated_pomodoros}{" "}
                    Pomodoros
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {activeTaskId !== task.id && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-white/50 hover:text-white"
                    onClick={() => setActiveTask(task.id)}
                    title="Focus on this task"
                  >
                    <Play className="size-4" />
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-white/50 hover:text-white"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-black/90 text-white backdrop-blur-xl"
                  >
                    <DropdownMenuItem
                      className="text-red-400 focus:text-red-400"
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
            <>
              <div className="py-2 text-center text-white/30 text-xs uppercase tracking-widest">
                Completed
              </div>
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-black/10 p-3 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, "todo")}
                      className="text-orange-500"
                    >
                      <CheckCircle2 className="size-5" />
                    </button>
                    <span className="font-medium text-sm text-white line-through">
                      {task.title}
                    </span>
                  </div>
                  <span className="text-white/40 text-xs">
                    {task.actual_pomodoros} Poms
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
