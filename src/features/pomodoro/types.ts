export type TimerMode = "focus" | "shortBreak" | "longBreak";
export type TimerState = "idle" | "running" | "paused";

export interface PomodoroSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // after X pomodoros
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  notificationSound: string;
  volume: number;
}

export interface PomodoroTask {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
}

export interface PomodoroSession {
  id: string;
  userId?: string;
  task: string;
  tag: string;
  tagColor: string;
  mode: TimerMode;
  duration: number; // actual minutes completed
  plannedDuration: number;
  startedAt: Date;
  completedAt?: Date;
  interrupted: boolean;
}

export interface PomodoroStats {
  totalSessions: number;
  totalFocusTime: number; // minutes
  currentStreak: number; // days
  bestStreak: number;
  lastSessionDate: Date;
  sessionsByTag: Record<string, number>;
  sessionsByDate: Record<string, number>;
}

export interface WhiteNoisePreset {
  id: string;
  name: string;
  emoji: string;
  audioUrl?: string;
  volume: number;
  isPremium: boolean;
  isActive: boolean;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  notificationSound: "bell",
  volume: 50,
};

export const TASK_TAGS = [
  { name: "Work", color: "#3b82f6" },
  { name: "Study", color: "#8b5cf6" },
  { name: "Personal", color: "#ec4899" },
  { name: "Exercise", color: "#10b981" },
  { name: "Reading", color: "#f59e0b" },
  { name: "Project", color: "#ef4444" },
] as const;

// Lofi Types
export interface Scene {
  id: string;
  name: string;
  variants: {
    day: {
      videoUrl: string;
    };
    night: {
      videoUrl: string;
    };
  };
  thumbnail: string;
  hasDayNight: boolean;
}

export interface Soundscape {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  audioUrl: string;
  volume: number; // 0-100
  isActive: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  author: string;
  coverUrl: string;
  tracks: Track[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
}
