import { useCallback, useEffect, useState } from "react";
import type { TimerMode, TimerState } from "../types";
import { getModeConfig } from "../utils";

export function usePomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [state, setState] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionCount, setSessionCount] = useState(1);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleTimerComplete = useCallback(() => {
    // Play completion sound
    // Save session to database
    // Update session count
    if (mode === "focus") {
      setSessionCount((prev) => prev + 1);
    }
  }, [mode]);

  // Timer countdown effect
  useEffect(() => {
    if (state !== "running") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer completed
          setState("idle");
          handleTimerComplete();
          return getModeConfig(mode).duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, mode, handleTimerComplete]);

  const start = useCallback(() => {
    setState("running");
  }, []);

  const pause = useCallback(() => {
    setState("paused");
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setTimeLeft(getModeConfig(mode).duration);
  }, [mode]);

  const changeMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setState("idle");
    setTimeLeft(getModeConfig(newMode).duration);
  }, []);

  return {
    mode,
    state,
    timeLeft,
    minutes,
    seconds,
    sessionCount,
    start,
    pause,
    reset,
    changeMode,
  };
}
