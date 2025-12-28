import { create } from "zustand";
import {
  type AchievementWithProgress,
  achievementService,
} from "@/services/achievement-service";

interface AchievementState {
  achievements: AchievementWithProgress[];
  isLoading: boolean;
  error: string | null;

  fetchAchievements: (userId: string) => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  isLoading: false,
  error: null,

  fetchAchievements: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await achievementService.getAchievementsWithProgress(userId);
      set({ achievements: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
