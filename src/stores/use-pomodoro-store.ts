import { CloudRain, Coffee, Flame, Wind } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Soundscape,
  TimerMode,
  TimerState,
} from "@/features/pomodoro/types";
import { getModeConfig } from "@/features/pomodoro/utils";

interface PomodoroState {
  // Scene State
  currentSceneId: string;
  isDayMode: boolean;

  // Music State
  currentPlaylistId: string | null;
  isPlaying: boolean;
  musicVolume: number;

  // Soundscape State
  soundscapes: Soundscape[];
  masterVolume: number;

  // Timer State
  mode: TimerMode;
  timerState: TimerState;
  timeLeft: number;
  duration: number;
  sessionCount: number;

  // Social State
  isLeaderboardOpen: boolean;
  isRoomSettingsOpen: boolean;
  isStreakOpen: boolean;

  // Actions
  setScene: (sceneId: string) => void;
  toggleDayMode: () => void;
  setMusicVolume: (volume: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setMasterVolume: (volume: number) => void;
  toggleSoundscape: (id: string) => void;
  setSoundscapeVolume: (id: string, volume: number) => void;

  // Timer Actions
  setMode: (mode: TimerMode) => void;
  setTimerState: (state: TimerState) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setSessionCount: (count: number | ((prev: number) => number)) => void;

  toggleLeaderboard: () => void;
  toggleRoomSettings: () => void;
  toggleStreak: () => void;
}

const INITIAL_SOUNDSCAPES: Soundscape[] = [
  {
    id: "rain",
    name: "Rain",
    icon: CloudRain,
    audioUrl: "",
    volume: 50,
    isActive: false,
  },
  {
    id: "fire",
    name: "Fire",
    icon: Flame,
    audioUrl: "",
    volume: 50,
    isActive: false,
  },
  {
    id: "cafe",
    name: "Cafe",
    icon: Coffee,
    audioUrl: "",
    volume: 50,
    isActive: false,
  },
  {
    id: "wind",
    name: "Wind",
    icon: Wind,
    audioUrl: "",
    volume: 50,
    isActive: false,
  },
];

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      currentSceneId: "bedroom",
      isDayMode: true,
      currentPlaylistId: "chill-lofi",
      isPlaying: false,
      musicVolume: 50,
      soundscapes: INITIAL_SOUNDSCAPES,
      masterVolume: 80,

      // Timer Initial State
      mode: "focus",
      timerState: "idle",
      timeLeft: 25 * 60,
      duration: 25 * 60,
      sessionCount: 0,

      isLeaderboardOpen: false,
      isRoomSettingsOpen: false,
      isStreakOpen: false,

      setScene: (sceneId) => set({ currentSceneId: sceneId }),
      toggleDayMode: () => set((state) => ({ isDayMode: !state.isDayMode })),
      setMusicVolume: (volume) => set({ musicVolume: volume }),

      setIsPlaying: (isPlaying) =>
        set((_state) => ({
          isPlaying,
          timerState: isPlaying ? "running" : "paused",
        })),

      setMasterVolume: (volume) => set({ masterVolume: volume }),

      toggleSoundscape: (id) =>
        set((state) => ({
          soundscapes: state.soundscapes.map((s) =>
            s.id === id ? { ...s, isActive: !s.isActive } : s,
          ),
        })),

      setSoundscapeVolume: (id, volume) =>
        set((state) => ({
          soundscapes: state.soundscapes.map((s) =>
            s.id === id ? { ...s, volume } : s,
          ),
        })),

      // Timer Actions
      setMode: (mode) => {
        const config = getModeConfig(mode);
        set({
          mode,
          timeLeft: config.duration,
          duration: config.duration,
          timerState: "idle",
          isPlaying: false,
        });
      },

      setTimerState: (timerState) =>
        set({
          timerState,
          isPlaying: timerState === "running",
        }),

      setTimeLeft: (value) =>
        set((state) => ({
          timeLeft: typeof value === "function" ? value(state.timeLeft) : value,
        })),

      setSessionCount: (value) =>
        set((state) => ({
          sessionCount:
            typeof value === "function" ? value(state.sessionCount) : value,
        })),

      toggleLeaderboard: () =>
        set((state) => ({ isLeaderboardOpen: !state.isLeaderboardOpen })),
      toggleRoomSettings: () =>
        set((state) => ({ isRoomSettingsOpen: !state.isRoomSettingsOpen })),
      toggleStreak: () =>
        set((state) => ({ isStreakOpen: !state.isStreakOpen })),
    }),
    {
      name: "pomodoro-storage",
      partialize: (state) => ({
        currentSceneId: state.currentSceneId,
        isDayMode: state.isDayMode,
        musicVolume: state.musicVolume,
        masterVolume: state.masterVolume,
        soundscapes: state.soundscapes,
        // Persist timer state? Maybe not timeLeft to avoid stale state on reload,
        // but sessionCount and mode might be useful.
        // For now, let's persist sessionCount.
        sessionCount: state.sessionCount,
      }),
    },
  ),
);
