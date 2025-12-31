import type { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TaskStatus as Status } from "@/services/task-service";

export type { Status };

export type Column = {
  id: UniqueIdentifier;
  title: string;
};

const defaultCols = [
  {
    id: "TODO" as const,
    title: "Todo",
  },
  {
    id: "IN_PROGRESS" as const,
    title: "In progress",
  },
  {
    id: "DONE" as const,
    title: "Done",
  },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

export type State = {
  columns: Column[];
  draggedTask: string | null;
};

export type Actions = {
  dragTask: (id: string | null) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set) => ({
      columns: defaultCols,
      draggedTask: null,
      updateCol: (id: UniqueIdentifier, newName: string) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title: newName } : col,
          ),
        })),
      removeCol: (id: UniqueIdentifier) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
        })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
    }),
    { name: "task-store", skipHydration: true },
  ),
);
