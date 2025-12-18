import { useCallback, useEffect, useRef } from "react";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useTaskStore } from "@/stores/use-task-store";
import { useTimerStore } from "@/stores/use-timer-store";
import { TimerEngine } from "../engines/timer-engine";
import { playCompletionSound } from "../services/audio-service";
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
  const engineRef = useRef<TimerEngine | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const changeMode = useCallback(
    (newMode: TimerMode) => {
      if (!engineRef.current) return;

      engineRef.current.stop();
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

      // Increment active task pomodoro count
      const { activeTaskId, incrementTaskPomodoro } = useTaskStore.getState();
      if (activeTaskId) {
        incrementTaskPomodoro(activeTaskId);
      }

      // Flow: Focus -> Short -> Focus -> Short -> Focus -> Long
      const nextCount = sessionCount + 1;
      if (nextCount % 3 === 0) {
        changeMode("longBreak");
      } else {
        changeMode("shortBreak");
      }
    } else {
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

  // Initialize Timer Engine
  useEffect(() => {
    engineRef.current = new TimerEngine();

    const unsubscribe = engineRef.current.on((event) => {
      if (event.type === "tick") {
        setTimeLeft(event.timeLeft);
      } else if (event.type === "complete") {
        handleTimerComplete();
      }
    });

    return () => {
      unsubscribe();
      engineRef.current?.destroy();
    };
  }, [handleTimerComplete, setTimeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // Request Notification Permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const start = useCallback(() => {
    if (!engineRef.current) return;

    sessionStartTimeRef.current = Date.now();
    setStatus("running");
    engineRef.current.start(timeLeft);
  }, [timeLeft, setStatus]);

  const pause = useCallback(() => {
    if (!engineRef.current) return;

    setStatus("paused");
    engineRef.current.pause();
  }, [setStatus]);

  const resume = useCallback(() => {
    if (!engineRef.current) return;

    setStatus("running");
    engineRef.current.resume();
  }, [setStatus]);

  const reset = useCallback(() => {
    if (!engineRef.current) return;

    engineRef.current.stop();
    const config = getModeConfig(mode);
    setTimeLeft(config.duration);
    setDuration(config.duration);
    setStatus("idle");
    sessionStartTimeRef.current = null;
  }, [mode, setTimeLeft, setDuration, setStatus]);

  const skip = useCallback(() => {
    if (!engineRef.current) return;

    engineRef.current.stop();
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
