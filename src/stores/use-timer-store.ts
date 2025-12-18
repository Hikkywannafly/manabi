import { create } from "zustand";
import type { TimerMode, TimerState } from "@/features/pomodoro/types";

interface TimerStoreState {
  // Timer State
  mode: TimerMode;
  status: TimerState;
  timeLeft: number; // seconds
  duration: number; // seconds
  sessionCount: number;

  // Actions
  setMode: (mode: TimerMode) => void;
  setStatus: (status: TimerState) => void;
  setTimeLeft: (timeLeft: number) => void;
  setDuration: (duration: number) => void;
  incrementSessionCount: () => void;
  resetSessionCount: () => void;
}

export const useTimerStore = create<TimerStoreState>((set) => ({
  // Initial State
  mode: "focus",
  status: "idle",
  timeLeft: 25 * 60,
  duration: 25 * 60,
  sessionCount: 0,

  // Actions
  setMode: (mode) => set({ mode }),
  setStatus: (status) => set({ status }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setDuration: (duration) => set({ duration }),
  incrementSessionCount: () =>
    set((state) => ({ sessionCount: state.sessionCount + 1 })),
  resetSessionCount: () => set({ sessionCount: 0 }),
}));
