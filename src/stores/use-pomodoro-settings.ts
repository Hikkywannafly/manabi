import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PomodoroSettings {
  // Timer Durations (in minutes)
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // After how many focus sessions

  // Auto-start
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;

  // Notifications
  notificationSound: string;
  notificationVolume: number;

  // Distraction Blocker (Phase 5)
  blockInternalNavigation: boolean;
  warnOnTabSwitch: boolean;
}

interface PomodoroSettingsStore {
  settings: PomodoroSettings;
  updateSettings: (updates: Partial<PomodoroSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  notificationSound: "bell",
  notificationVolume: 50,
  blockInternalNavigation: false,
  warnOnTabSwitch: false,
};

export const usePomodoroSettings = create<PomodoroSettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      resetSettings: () =>
        set({
          settings: DEFAULT_SETTINGS,
        }),
    }),
    {
      name: "pomodoro-settings",
    },
  ),
);
