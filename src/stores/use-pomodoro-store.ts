import { CloudRain, Coffee, Flame, Wind } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Scene, Soundscape } from "@/features/pomodoro/types";

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

  toggleLeaderboard: () => void;
  toggleRoomSettings: () => void;
  toggleStreak: () => void;
}

export const SCENES: Scene[] = [
  {
    id: "bedroom",
    name: "Cozy Bedroom",
    variants: {
      day: {
        videoUrl:
          "https://1230610135274225734.discordsays.com/.proxy/static-assets/scenes/chill-vibes/bedroom/videos/day-rain.mp4",
      },
      night: {
        videoUrl:
          "https://1230610135274225734.discordsays.com/.proxy/static-assets/scenes/chill-vibes/bedroom/videos/night-rain.mp4",
      },
    },
    thumbnail:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=300&auto=format&fit=crop",
    hasDayNight: true,
  },
  {
    id: "cafe",
    name: "Midnight Cafe",
    variants: {
      day: {
        videoUrl:
          "https://1230610135274225734.discordsays.com/.proxy/static-assets/scenes/book-cafe/book-cafe-in/videos/day.mp4",
      },
      night: {
        videoUrl:
          "https://1230610135274225734.discordsays.com/.proxy/static-assets/scenes/book-cafe/book-cafe-in/videos/night.mp4",
      },
    },
    thumbnail:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300&auto=format&fit=crop",
    hasDayNight: true,
  },
];

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

      isLeaderboardOpen: false,
      isRoomSettingsOpen: false,
      isStreakOpen: false,

      setScene: (sceneId) => set({ currentSceneId: sceneId }),
      toggleDayMode: () => set((state) => ({ isDayMode: !state.isDayMode })),
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
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
        soundscapes: state.soundscapes, // Persist active soundscapes and volumes
      }),
    },
  ),
);
