import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { statsService } from "@/services/stats-service";

interface StatsState {
  selectedPeriod: "daily" | "weekly" | "monthly";
  streak: number;
  isLoading: boolean;

  setSelectedPeriod: (period: "daily" | "weekly" | "monthly") => void;
  fetchStreak: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  selectedPeriod: "weekly",
  streak: 0,
  isLoading: false,

  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  fetchStreak: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const streak = await statsService.getStreak(user.id);
        set({ streak });
      }
    } catch (error) {
      console.error("Failed to fetch streak:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
