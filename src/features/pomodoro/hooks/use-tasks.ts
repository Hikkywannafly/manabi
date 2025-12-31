import { useMemo } from "react";
import { useTaskStore } from "@/stores/use-task-store";

export function useTasks() {
  const { tasks, ...rest } = useTaskStore();

  const statusWeight = { IN_PROGRESS: 2, TODO: 1, DONE: 0 };
  const priorityWeight = { high: 3, medium: 2, low: 1 };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // 1. Sort by Status
      const sA = statusWeight[a.status as keyof typeof statusWeight] ?? 0;
      const sB = statusWeight[b.status as keyof typeof statusWeight] ?? 0;
      if (sA !== sB) return sB - sA;

      // 2. Sort by Priority
      const pA = priorityWeight[a.priority as keyof typeof priorityWeight] ?? 0;
      const pB = priorityWeight[b.priority as keyof typeof priorityWeight] ?? 0;
      if (pA !== pB) return pB - pA;

      // 3. Fallback to creation date (newest first)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [tasks]);

  const todoTasks = useMemo(
    () => sortedTasks.filter((t) => t.status !== "DONE"),
    [sortedTasks],
  );

  const doneTasks = useMemo(
    () => sortedTasks.filter((t) => t.status === "DONE"),
    [sortedTasks],
  );

  return {
    ...rest,
    tasks: sortedTasks,
    todoTasks,
    doneTasks,
  };
}
