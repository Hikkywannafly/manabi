import { create } from "zustand";
import {
  type LeaderboardEntry,
  leaderboardService,
} from "@/services/leaderboard-service";

interface LeaderboardState {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  global: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;

  fetchDailyLeaderboard: () => Promise<void>;
  fetchWeeklyLeaderboard: () => Promise<void>;
  fetchGlobalLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  daily: [],
  weekly: [],
  global: [],
  isLoading: false,
  error: null,

  fetchDailyLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await leaderboardService.getDailyLeaderboard();
      set({ daily: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchWeeklyLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await leaderboardService.getWeeklyLeaderboard();
      set({ weekly: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchGlobalLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await leaderboardService.getGlobalLeaderboard();
      set({ global: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
