import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import {
  type Task,
  type TaskStatus,
  taskService,
} from "@/services/task-service";

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: () => taskService.getTasks(),
    enabled: !!user,
  });

  const createTaskMutation = useMutation({
    mutationFn: ({
      title,
      description,
      status,
    }: {
      title: string;
      description?: string;
      status?: TaskStatus;
    }) => taskService.createTask(title, description, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${(error as Error).message}`);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      taskService.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${(error as Error).message}`);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error(`Failed to delete task: ${(error as Error).message}`);
    },
  });

  const reorderTasksMutation = useMutation({
    mutationFn: (
      tasksToUpdate: {
        id: string;
        position_order: number;
        status: TaskStatus;
      }[],
    ) => taskService.reorderTasks(tasksToUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    reorderTasks: reorderTasksMutation.mutate,
  };
}
