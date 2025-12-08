import { create } from "zustand";
import { type Task, taskService } from "@/services/task-service";

interface TaskState {
  tasks: Task[];
  activeTaskId: string | null;
  isLoading: boolean;

  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (title: string, estimatedPomodoros?: number) => Promise<void>;
  updateTaskStatus: (id: string, status: Task["status"]) => Promise<void>;
  incrementTaskPomodoro: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setActiveTask: (id: string | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  activeTaskId: null,
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskService.getTasks();
      set({ tasks });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (title, estimatedPomodoros = 1) => {
    try {
      const newTask = await taskService.createTask(title, estimatedPomodoros);
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  },

  updateTaskStatus: async (id, status) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));

    try {
      await taskService.updateTask(id, { status });
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Revert on failure (could be improved)
      get().fetchTasks();
    }
  },

  incrementTaskPomodoro: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newCount = task.actual_pomodoros + 1;

    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, actual_pomodoros: newCount } : t,
      ),
    }));

    try {
      await taskService.updateTask(id, { actual_pomodoros: newCount });
    } catch (error) {
      console.error("Failed to increment task pomodoro:", error);
      get().fetchTasks();
    }
  },

  deleteTask: async (id) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
    }));

    try {
      await taskService.deleteTask(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      get().fetchTasks();
    }
  },

  setActiveTask: (id) => set({ activeTaskId: id }),
}));
