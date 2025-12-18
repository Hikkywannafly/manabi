import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MusicProvider = "spotify" | "youtube";

interface MusicState {
  provider: MusicProvider;
  url: string;
  isPlaying: boolean;
  isMenuOpen: boolean;

  setProvider: (provider: MusicProvider) => void;
  setUrl: (url: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleMenu: () => void;
  setMenuOpen: (isOpen: boolean) => void;
  reset: () => void;
}

const DEFAULT_SPOTIFY_URL =
  "https://open.spotify.com/embed/track/3SKiLglljLbKr5j0IhXqYd?theme=1";
// Default to lofi girl
const _DEFAULT_YOUTUBE_URL = "https://www.youtube.com/embed/jfKfPfyJRdk";

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      provider: "spotify",
      url: DEFAULT_SPOTIFY_URL,
      isPlaying: false,
      isMenuOpen: false,

      setProvider: (provider) => set({ provider }),
      setUrl: (url) => set({ url }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
      reset: () =>
        set({
          provider: "spotify",
          url: DEFAULT_SPOTIFY_URL,
          isPlaying: false,
          isMenuOpen: false,
        }),
    }),
    {
      name: "music-storage",
      partialize: (state) => ({
        provider: state.provider,
        url: state.url,
        isPlaying: state.isPlaying,
        isMenuOpen: state.isMenuOpen,
      }),
    },
  ),
);
