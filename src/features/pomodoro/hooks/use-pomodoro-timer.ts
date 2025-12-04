import { useCallback, useEffect } from "react";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { playCompletionSound } from "../services/audio-service";
import type { TimerMode } from "../types";

export function usePomodoroTimer() {
  const {
    mode,
    timerState,
    timeLeft,
    duration,
    sessionCount,
    setMode,
    setTimeLeft,
    setSessionCount,
    setIsPlaying,
    saveSession,
  } = usePomodoroStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleTimerComplete = useCallback(() => {
    playCompletionSound();

    // Save session to Supabase
    const endTime = new Date();
    // Calculate start time based on duration
    // duration is in seconds
    const startTime = new Date(endTime.getTime() - duration * 1000);

    saveSession({
      mode,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_minutes: Math.round(duration / 60),
    });

    if (mode === "focus") {
      const nextCount = sessionCount + 1;
      setSessionCount(nextCount);

      // Flow: Focus -> Short -> Focus -> Short -> Focus -> Long
      // 3 Focus sessions per cycle
      if (nextCount % 3 === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }
    } else {
      // After break, back to focus
      setMode("focus");
    }

    // Auto-pause after completion (default behavior)
    setIsPlaying(false);
  }, [
    mode,
    sessionCount,
    duration,
    setSessionCount,
    setMode,
    setIsPlaying,
    saveSession,
  ]);

  // Timer countdown effect
  useEffect(() => {
    if (timerState !== "running") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState, setTimeLeft]);

  // Handle completion when time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && timerState !== "idle") {
      handleTimerComplete();
    }
  }, [timeLeft, timerState, handleTimerComplete]);

  const start = useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const reset = useCallback(() => {
    setMode(mode);
  }, [mode, setMode]);

  const skip = useCallback(() => {
    handleTimerComplete();
  }, [handleTimerComplete]);

  const changeMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
    },
    [setMode],
  );

  return {
    mode,
    state: timerState,
    timeLeft,
    minutes,
    seconds,
    sessionCount,
    start,
    pause,
    reset,
    skip,
    changeMode,
  };
}
