import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  type PomodoroSession,
  pomodoroService,
} from "@/services/pomodoro-service";

interface PomodoroState {
  // Scene State
  currentSceneId: string;
  isDayMode: boolean;

  // View State
  activeView: "focus" | "timer";

  // Social State
  isLeaderboardOpen: boolean;
  isRoomSettingsOpen: boolean;
  isStreakOpen: boolean;

  // Actions
  setScene: (sceneId: string) => void;
  toggleDayMode: () => void;
  setActiveView: (view: "focus" | "timer") => void;

  toggleLeaderboard: () => void;
  toggleRoomSettings: () => void;
  toggleStreak: () => void;

  saveSession: (
    session: Omit<PomodoroSession, "id" | "created_at" | "user_id">,
  ) => Promise<void>;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      currentSceneId: "bedroom",
      isDayMode: true,
      activeView: "focus",

      isLeaderboardOpen: false,
      isRoomSettingsOpen: false,
      isStreakOpen: false,

      setScene: (sceneId) => set({ currentSceneId: sceneId }),
      toggleDayMode: () => set((state) => ({ isDayMode: !state.isDayMode })),
      setActiveView: (view) => set({ activeView: view }),

      toggleLeaderboard: () =>
        set((state) => ({ isLeaderboardOpen: !state.isLeaderboardOpen })),
      toggleRoomSettings: () =>
        set((state) => ({ isRoomSettingsOpen: !state.isRoomSettingsOpen })),
      toggleStreak: () =>
        set((state) => ({ isStreakOpen: !state.isStreakOpen })),

      saveSession: async (sessionData) => {
        try {
          await pomodoroService.createSession(sessionData);
        } catch (error) {
          console.error("Failed to save session:", error);
        }
      },
    }),
    {
      name: "pomodoro-storage",
      partialize: (state) => ({
        currentSceneId: state.currentSceneId,
        isDayMode: state.isDayMode,
        activeView: state.activeView,
      }),
    },
  ),
);
