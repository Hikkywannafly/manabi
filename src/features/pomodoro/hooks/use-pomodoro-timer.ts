import { useCallback, useEffect, useRef } from "react";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useTaskStore } from "@/stores/use-task-store";
import { useTimerStore } from "@/stores/use-timer-store";
import { playCompletionSound } from "../services/audio-service";
import {
  pauseGlobalTimer,
  resumeGlobalTimer,
  startGlobalTimer,
  stopGlobalTimer,
  subscribeToGlobalTimer,
} from "../services/global-timer";
import type { TimerMode } from "../types";
import { getModeConfig } from "../utils";

export function usePomodoroTimer() {
  const {
    mode,
    status,
    timeLeft,
    duration,
    sessionCount,
    setMode: setTimerMode,
    setStatus,
    setTimeLeft,
    setDuration,
    incrementSessionCount,
  } = useTimerStore();

  const { saveSession } = usePomodoroStore();
  const sessionStartTimeRef = useRef<number | null>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const changeMode = useCallback(
    (newMode: TimerMode) => {
      stopGlobalTimer();
      const config = getModeConfig(newMode);

      setTimerMode(newMode);
      setTimeLeft(config.duration);
      setDuration(config.duration);
      setStatus("idle");
      sessionStartTimeRef.current = null;
    },
    [setTimerMode, setTimeLeft, setDuration, setStatus],
  );

  const handleTimerComplete = useCallback(() => {
    playCompletionSound();

    // Calculate actual session time
    const endTime = Date.now();
    const startTime = sessionStartTimeRef.current || endTime - duration * 1000;

    // Save session to Supabase
    saveSession({
      mode,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      duration_minutes: Math.round(duration / 60),
    });

    if (mode === "focus") {
      incrementSessionCount();
      const nextCount = sessionCount + 1;

      // Increment active task pomodoro count
      const { activeTaskId, incrementTaskPomodoro } = useTaskStore.getState();
      if (activeTaskId) {
        incrementTaskPomodoro(activeTaskId);
      }

      // Flow: Focus -> Short -> Focus -> Short -> Focus -> Short -> Focus -> Long
      if (nextCount > 0 && nextCount % 4 === 0) {
        changeMode("longBreak");
      } else {
        changeMode("shortBreak");
      }
    } else {
      if (mode === "longBreak") {
        const { resetSessionCount } = useTimerStore.getState();
        resetSessionCount();
      }
      changeMode("focus");
    }

    setStatus("idle");
    sessionStartTimeRef.current = null;

    // Send notification
    if (Notification.permission === "granted") {
      new Notification("Manabi Timer", {
        body: `${mode === "focus" ? "Focus session" : "Break"} complete!`,
        icon: "/icon.png",
      });
    }
  }, [
    mode,
    sessionCount,
    duration,
    saveSession,
    incrementSessionCount,
    setStatus,
    changeMode,
  ]);

  // Subscribe to global timer events
  useEffect(() => {
    const unsubscribe = subscribeToGlobalTimer((event) => {
      if (event.type === "tick") {
        setTimeLeft(event.timeLeft);
      } else if (event.type === "complete") {
        handleTimerComplete();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [handleTimerComplete, setTimeLeft]);

  // Request Notification Permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const start = useCallback(() => {
    sessionStartTimeRef.current = Date.now();
    setStatus("running");
    startGlobalTimer(timeLeft);
  }, [timeLeft, setStatus]);

  const pause = useCallback(() => {
    setStatus("paused");
    pauseGlobalTimer();
  }, [setStatus]);

  const resume = useCallback(() => {
    setStatus("running");
    resumeGlobalTimer();
  }, [setStatus]);

  const reset = useCallback(() => {
    stopGlobalTimer();
    const config = getModeConfig(mode);
    setTimeLeft(config.duration);
    setDuration(config.duration);
    setStatus("idle");
    sessionStartTimeRef.current = null;
  }, [mode, setTimeLeft, setDuration, setStatus]);

  const skip = useCallback(() => {
    stopGlobalTimer();
    handleTimerComplete();
  }, [handleTimerComplete]);

  return {
    mode,
    state: status,
    timeLeft,
    minutes,
    seconds,
    sessionCount,
    start,
    pause,
    resume,
    reset,
    skip,
    changeMode,
  };
}
