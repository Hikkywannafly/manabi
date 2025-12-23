import { CloudRain, Coffee, Flame, Wind } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Soundscape } from "@/features/pomodoro/types";

interface AudioState {
  // Soundscape State
  soundscapes: Soundscape[];
  masterVolume: number;

  // Music State
  currentPlaylistId: string | null;
  isMusicPlaying: boolean;

  // Actions
  setMasterVolume: (volume: number) => void;
  toggleSoundscape: (id: string) => void;
  setSoundscapeVolume: (id: string, volume: number) => void;
  setCurrentPlaylist: (id: string) => void;
  setIsMusicPlaying: (isPlaying: boolean) => void;
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

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      soundscapes: INITIAL_SOUNDSCAPES,
      masterVolume: 80,
      currentPlaylistId: null,
      isMusicPlaying: false,

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

      setCurrentPlaylist: (id) => set({ currentPlaylistId: id }),
      setIsMusicPlaying: (isPlaying) => set({ isMusicPlaying: isPlaying }),
    }),
    {
      name: "audio-storage",
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        soundscapes: state.soundscapes,
        currentPlaylistId: state.currentPlaylistId,
        isMusicPlaying: state.isMusicPlaying,
      }),
    },
  ),
);
