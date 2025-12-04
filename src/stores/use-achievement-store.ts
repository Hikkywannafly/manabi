import { create } from "zustand";
import {
  type Achievement,
  achievementService,
  type UserAchievement,
} from "@/services/achievement-service";

interface AchievementState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  isLoading: boolean;
  error: string | null;

  fetchAchievements: () => Promise<void>;
  fetchUserAchievements: (userId: string) => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  userAchievements: [],
  isLoading: false,
  error: null,

  fetchAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await achievementService.getAchievements();
      set({ achievements: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserAchievements: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await achievementService.getUserAchievements(userId);
      set({ userAchievements: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
