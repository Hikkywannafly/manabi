"use client";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Task, TaskStatus } from "@/services/task-service";
import { useKanbanAnnouncements } from "../hooks/use-kanban-announcements";
import { useKanbanDrag } from "../hooks/use-kanban-drag";
import { useTasks } from "../hooks/use-tasks";
import { useTaskStore } from "../utils/store";
import { BoardColumn, BoardContainer } from "./board-column";
import { TaskCard } from "./task-card";

const getDisplayTasks = (tasks: Task[], columnId: string) => {
  const columnTasks = tasks.filter((task) => task.status === columnId);

  if (columnId === "TODO") {
    return [...columnTasks].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const weightDiff =
        priorityWeight[b.priority] - priorityWeight[a.priority];
      if (weightDiff !== 0) return weightDiff;
      return a.position_order - b.position_order;
    });
  }

  return columnTasks;
};

export type { ColumnId } from "./board-column";

export function KanbanBoard() {
  const columns = useTaskStore((state) => state.columns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const { tasks: dbTasks, isLoading, reorderTasks } = useTasks();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Sync localTasks with dbTasks when not dragging
  useEffect(() => {
    if (dbTasks.length > 0) {
      setLocalTasks(dbTasks);
    }
  }, [dbTasks]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Use custom hook for drag & drop logic
  const { dragState, handleDragStart, handleDragEnd, handleDragOver } =
    useKanbanDrag({
      tasks: localTasks,
      onTasksUpdate: setLocalTasks,
      onDragComplete: (updatedTasks) => {
        // Prepare reorder data for mutation
        const reorderData = updatedTasks.map((task, index) => ({
          id: task.id,
          position_order: index,
          status: task.status as TaskStatus,
        }));
        reorderTasks(reorderData);
      },
    });

  // Use custom hook for accessibility announcements
  const announcements = useKanbanAnnouncements({
    tasks: localTasks,
    columns,
    columnsId,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (isLoading) return <div>Loading board...</div>;

  return (
    <div className="h-full w-full">
      <DndContext
        accessibility={{
          announcements,
        }}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <BoardContainer>
          <SortableContext items={columnsId}>
            {columns?.map((col) => {
              const displayTasks = getDisplayTasks(
                localTasks,
                col.id as string,
              );
              return (
                <BoardColumn key={col.id} column={col} tasks={displayTasks} />
              );
            })}
          </SortableContext>
        </BoardContainer>

        {"document" in window &&
          createPortal(
            <DragOverlay>
              {dragState.activeColumn && (
                <BoardColumn
                  isOverlay
                  column={dragState.activeColumn}
                  tasks={getDisplayTasks(
                    localTasks,
                    dragState.activeColumn.id as string,
                  )}
                />
              )}
              {dragState.activeTask && (
                <TaskCard task={dragState.activeTask} isOverlay />
              )}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  );
}
