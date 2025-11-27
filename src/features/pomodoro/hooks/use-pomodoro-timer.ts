import { useCallback, useEffect } from "react";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { playCompletionSound } from "../services/audio-service";
import type { TimerMode } from "../types";

export function usePomodoroTimer() {
  const {
    mode,
    timerState,
    timeLeft,
    sessionCount,
    setMode,
    setTimeLeft,
    setSessionCount,
    setIsPlaying,
  } = usePomodoroStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleTimerComplete = useCallback(() => {
    playCompletionSound();

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
  }, [mode, sessionCount, setSessionCount, setMode, setIsPlaying]);

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
