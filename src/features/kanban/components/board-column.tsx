import { type UniqueIdentifier, useDndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Task } from "../utils/store";
import { ColumnActions } from "./column-action";
import { TaskCard } from "./task-card";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

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

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
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

  const variants = cva(
    "flex h-[75vh] max-h-[75vh] w-[350px] max-w-full shrink-0 snap-center flex-col bg-secondary",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "opacity-30 ring-2",
          overlay: "ring-2 ring-primary",
        },
      },
    },
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="space-between flex flex-row items-center border-b-2 p-4 text-left font-semibold">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="-ml-2 relative h-auto cursor-grab p-1 text-primary/50"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <IconGripVertical />
        </Button>
        <span className="mr-auto ml-2"> {column.title}</span>
        <ColumnActions id={column.id} title={column.title} />
      </CardHeader>
      <CardContent className="flex grow flex-col gap-4 overflow-x-hidden p-2">
        <ScrollArea className="h-full">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("flex px-2 pb-4 md:px-0 lg:justify-start", {
    variants: {
      dragging: {
        default: "",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div
        className={variations({
          dragging: dndContext.active ? "active" : "default",
        })}
      >
        <div className="flex flex-row items-start justify-center gap-4">
          {children}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
