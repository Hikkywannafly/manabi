import { create } from "zustand";

interface StatsState {
  selectedPeriod: "daily" | "weekly" | "monthly";
  setSelectedPeriod: (period: "daily" | "weekly" | "monthly") => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  selectedPeriod: "weekly",
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
}));
