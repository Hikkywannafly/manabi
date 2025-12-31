import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useRef, useState } from "react";
import type { TaskStatus as Status, Task } from "@/services/task-service";
import type { Column } from "../components/board-column";
import { hasDraggableData } from "../utils";

interface UseDragHandlersProps {
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  onDragComplete?: (tasks: Task[]) => void;
}

interface DragState {
  activeColumn: Column | null;
  activeTask: Task | null;
}

export function useKanbanDrag({
  tasks,
  onTasksUpdate,
  onDragComplete,
}: UseDragHandlersProps) {
  const [dragState, setDragState] = useState<DragState>({
    activeColumn: null,
    activeTask: null,
  });

  // Keep track of tasks before drag started to detect changes
  const initialTasksRef = useRef<Task[] | null>(null);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (!hasDraggableData(event.active)) return;

      const data = event.active.data.current;
      initialTasksRef.current = tasks;

      if (data?.type === "Column") {
        setDragState((prev) => ({ ...prev, activeColumn: data.column }));
        return;
      }

      if (data?.type === "Task") {
        setDragState((prev) => ({ ...prev, activeTask: data.task }));
      }
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    (_event: DragEndEvent) => {
      setDragState({ activeColumn: null, activeTask: null });

      // Check if tasks were modified and trigger completion callback
      if (onDragComplete && initialTasksRef.current) {
        const hasChanged =
          JSON.stringify(initialTasksRef.current) !== JSON.stringify(tasks);
        if (hasChanged) {
          onDragComplete(tasks);
        }
      }
      initialTasksRef.current = null;
    },
    [tasks, onDragComplete],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      if (!(hasDraggableData(active) && hasDraggableData(over))) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      const isActiveATask = activeData?.type === "Task";
      const isOverATask = overData?.type === "Task";
      const isOverAColumn = overData?.type === "Column";

      if (!isActiveATask) return;

      // Case 1: Dragging task over another task
      if (isActiveATask && isOverATask) {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);

        if (activeIndex === -1 || overIndex === -1) return;

        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];

        if (!(activeTask && overTask)) return;

        // Create new tasks array with immutable update
        let updatedTasks = [...tasks];

        // If moving to different column, update status
        if (activeTask.status !== overTask.status) {
          updatedTasks = updatedTasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, status: overTask.status }
              : task,
          );
        }

        // Reorder tasks
        const newActiveIndex = updatedTasks.findIndex(
          (t) => t.id === active.id,
        );
        const newOverIndex = updatedTasks.findIndex((t) => t.id === over.id);
        updatedTasks = arrayMove(updatedTasks, newActiveIndex, newOverIndex);

        onTasksUpdate(updatedTasks);
        return;
      }

      // Case 2: Dragging task over a column
      if (isActiveATask && isOverAColumn) {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        if (activeIndex === -1) return;

        const activeTask = tasks[activeIndex];
        if (!activeTask) return;

        const newStatus = over.id as Status;

        // Only update if status actually changes
        if (activeTask.status === newStatus) return;

        // Create new tasks array with immutable update
        const updatedTasks = tasks.map((task) =>
          task.id === activeTask.id ? { ...task, status: newStatus } : task,
        );

        onTasksUpdate(updatedTasks);
      }
    },
    [tasks, onTasksUpdate],
  );

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
}
