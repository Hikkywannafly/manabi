"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/stores/use-task-store";
import { useTimerStore } from "@/stores/use-timer-store";

export function PomodoroTitleUpdater() {
  const { mode, timeLeft } = useTimerStore();
  const { tasks, activeTaskId } = useTaskStore();

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const activeTask = tasks.find((t) => t.id === activeTaskId);
    let statusText = "";

    if (mode === "focus") {
      statusText = activeTask ? activeTask.title : "Focus";
    } else if (mode === "shortBreak") {
      statusText = "Short Break";
    } else if (mode === "longBreak") {
      statusText = "Long Break";
    }

    document.title = `${timeString} - ${statusText}`;

    // Reset title when component unmounts
    return () => {
      document.title = "Manabi";
    };
  }, [mode, timeLeft, tasks, activeTaskId]);

  return null;
}
