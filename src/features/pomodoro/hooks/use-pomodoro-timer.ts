import { useCallback, useEffect, useRef } from "react";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useTaskStore } from "@/stores/use-task-store";
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

  const workerRef = useRef<Worker | null>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleTimerComplete = useCallback(() => {
    playCompletionSound();

    // Save session to Supabase
    const endTime = new Date();
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

      // Increment active task pomodoro count
      const { activeTaskId, incrementTaskPomodoro } = useTaskStore.getState();
      if (activeTaskId) {
        incrementTaskPomodoro(activeTaskId);
      }

      // Flow: Focus -> Short -> Focus -> Short -> Focus -> Long
      if (nextCount % 3 === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }
    } else {
      setMode("focus");
    }

    setIsPlaying(false);

    // Send notification
    if (Notification.permission === "granted") {
      new Notification("Manabi Timer", {
        body: `${mode === "focus" ? "Focus session" : "Break"} complete!`,
        icon: "/icon.png", // Make sure this exists or remove
      });
    }
  }, [
    mode,
    sessionCount,
    duration,
    setSessionCount,
    setMode,
    setIsPlaying,
    saveSession,
  ]);

  // Initialize Worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/timer.worker.ts", import.meta.url),
    );

    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === "TICK") {
        setTimeLeft(payload.timeLeft);
      } else if (type === "COMPLETE") {
        handleTimerComplete();
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [setTimeLeft, handleTimerComplete]);

  // Sync Worker with State
  // biome-ignore lint/correctness/useExhaustiveDependencies: timeLeft is intentionally omitted to avoid restarting the worker on every tick
  useEffect(() => {
    if (timerState === "running") {
      workerRef.current?.postMessage({
        type: "START",
        payload: { duration: timeLeft },
      });
    } else {
      workerRef.current?.postMessage({ type: "PAUSE" });
    }
  }, [timerState]); // Don't include timeLeft here to avoid restart loops

  // Request Notification Permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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
