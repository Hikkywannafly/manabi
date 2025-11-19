import type { TimerMode } from "./types";

export interface ModeConfig {
  label: string;
  duration: number; // in seconds
  gradient: string;
}

/**
 * Get configuration for a timer mode
 */
export function getModeConfig(mode: TimerMode): ModeConfig {
  switch (mode) {
    case "focus":
      return {
        label: "Focus",
        duration: 25 * 60,
        gradient: "from-violet-500 via-purple-500 to-indigo-600",
      };
    case "shortBreak":
      return {
        label: "Short Break",
        duration: 5 * 60,
        gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      };
    case "longBreak":
      return {
        label: "Long Break",
        duration: 15 * 60,
        gradient: "from-pink-400 via-rose-500 to-red-500",
      };
  }
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Format duration in human-readable format (e.g., "1h 30m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Calculate percentage of time elapsed
 */
export function getTimeProgress(
  timeLeft: number,
  totalDuration: number,
): number {
  return ((totalDuration - timeLeft) / totalDuration) * 100;
}
