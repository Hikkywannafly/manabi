"use client";

import { type UniqueIdentifier, useDndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Task } from "@/services/task-service";
import { TaskCard } from "./task-card";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnId = UniqueIdentifier;

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("flex h-full w-full flex-col rounded-lg bg-secondary", {
    variants: {
      dragging: {
        default: "border-2 border-transparent",
        over: "opacity-30 ring-2",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="flex shrink-0 flex-row items-center border-b-2 p-4 text-left font-semibold">
        <span className="text-lg">{column.title}</span>
      </CardHeader>
      <CardContent className="flex grow flex-col overflow-hidden p-0">
        <ScrollArea className="h-full w-full px-3 py-2">
          <div className="min-h-[100px] space-y-2 pr-3">
            <SortableContext items={tasksIds}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SortableContext>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const containerVariants = cva("grid h-full w-full grid-rows-1 gap-4 p-4", {
    variants: {
      dragging: {
        default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        active: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      },
    },
  });

  return (
    <div
      className={containerVariants({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      {children}
    </div>
  );
}
