import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconDots, IconGripVertical } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/services/task-service";
import { useTasks } from "../hooks/use-tasks";
import { EditTaskDialog } from "./edit-task-dialog";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const { deleteTask } = useTasks();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("group relative mb-2", {
    variants: {
      dragging: {
        over: "opacity-30 ring-2",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const priorityColors = {
    low: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    medium: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    high: "bg-red-100 text-red-700 hover:bg-red-100",
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}
      >
        <CardHeader className="space-between relative flex flex-row items-center border-secondary border-b-2 px-3 py-2">
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
          >
            <span className="sr-only">Move task</span>
            <IconGripVertical size={18} />
          </Button>

          <Badge
            variant={"secondary"}
            className={`capitalize ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ml-auto h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <IconDots size={18} />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => deleteTask(task.id)}
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap px-3 pt-3 pb-4 text-left">
          <div className="font-medium text-sm leading-tight">{task.title}</div>
          {task.description && (
            <div className="mt-2 line-clamp-2 text-muted-foreground text-xs">
              {task.description}
            </div>
          )}
        </CardContent>
      </Card>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
