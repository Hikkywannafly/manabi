import type { Announcements, UniqueIdentifier } from "@dnd-kit/core";
import { useCallback, useMemo, useRef } from "react";
import type { Task } from "@/services/task-service";
import type { Column, ColumnId } from "../components/board-column";
import { hasDraggableData } from "../utils";

interface UseKanbanAnnouncementsProps {
  tasks: Task[];
  columns: Column[];
  columnsId: UniqueIdentifier[];
}

export function useKanbanAnnouncements({
  tasks,
  columns,
  columnsId,
}: UseKanbanAnnouncementsProps) {
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);

  // Memoized helper function
  const getDraggingTaskData = useCallback(
    (taskId: UniqueIdentifier, columnId: ColumnId) => {
      const tasksInColumn = tasks.filter((task) => task.status === columnId);
      const taskPosition = tasksInColumn.findIndex(
        (task) => task.id === taskId,
      );
      const column = columns.find((col) => col.id === columnId);
      return {
        tasksInColumn,
        taskPosition,
        column,
      };
    },
    [tasks, columns],
  );

  const announcements: Announcements = useMemo(
    () => ({
      onDragStart({ active }) {
        if (!hasDraggableData(active)) return;

        if (active.data.current?.type === "Column") {
          const startColumnIdx = columnsId.indexOf(active.id);
          const startColumn = columns[startColumnIdx];
          return `Picked up Column ${startColumn?.title} at position: ${
            startColumnIdx + 1
          } of ${columnsId.length}`;
        }

        if (active.data.current?.type === "Task") {
          pickedUpTaskColumn.current = active.data.current.task.status;
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            active.id,
            active.data.current.task.status,
          );
          return `Picked up Task ${active.data.current.task.title} at position: ${
            taskPosition + 1
          } of ${tasksInColumn.length} in column ${column?.title}`;
        }
      },

      onDragOver({ active, over }) {
        if (!(hasDraggableData(active) && hasDraggableData(over))) return;

        if (
          active.data.current?.type === "Column" &&
          over.data.current?.type === "Column"
        ) {
          const overColumnIdx = columnsId.indexOf(over.id);
          return `Column ${active.data.current.column.title} was moved over ${
            over.data.current.column.title
          } at position ${overColumnIdx + 1} of ${columnsId.length}`;
        }

        if (
          active.data.current?.type === "Task" &&
          over.data.current?.type === "Task"
        ) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            over.id,
            over.data.current.task.status,
          );
          if (over.data.current.task.status !== pickedUpTaskColumn.current) {
            return `Task ${
              active.data.current.task.title
            } was moved over column ${column?.title} in position ${
              taskPosition + 1
            } of ${tasksInColumn.length}`;
          }
          return `Task was moved over position ${taskPosition + 1} of ${
            tasksInColumn.length
          } in column ${column?.title}`;
        }
      },

      onDragEnd({ active, over }) {
        if (!(hasDraggableData(active) && hasDraggableData(over))) {
          pickedUpTaskColumn.current = null;
          return;
        }

        if (
          active.data.current?.type === "Column" &&
          over.data.current?.type === "Column"
        ) {
          const overColumnPosition = columnsId.indexOf(over.id);
          return `Column ${
            active.data.current.column.title
          } was dropped into position ${overColumnPosition + 1} of ${
            columnsId.length
          }`;
        }

        if (
          active.data.current?.type === "Task" &&
          over.data.current?.type === "Task"
        ) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            over.id,
            over.data.current.task.status,
          );
          if (over.data.current.task.status !== pickedUpTaskColumn.current) {
            return `Task was dropped into column ${column?.title} in position ${
              taskPosition + 1
            } of ${tasksInColumn.length}`;
          }
          return `Task was dropped into position ${taskPosition + 1} of ${
            tasksInColumn.length
          } in column ${column?.title}`;
        }
        pickedUpTaskColumn.current = null;
      },

      onDragCancel({ active }) {
        pickedUpTaskColumn.current = null;
        if (!hasDraggableData(active)) return;
        return `Dragging ${active.data.current?.type} cancelled.`;
      },
    }),
    [columns, columnsId, getDraggingTaskData],
  );

  return announcements;
}
