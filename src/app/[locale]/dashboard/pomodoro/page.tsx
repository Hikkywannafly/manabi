"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { BackgroundMusicPlayer } from "@/features/pomodoro/components/background-music-player";
import { BackgroundScene } from "@/features/pomodoro/components/background-scene";
import { ControlBar } from "@/features/pomodoro/components/control-bar";
import { DigitalClock } from "@/features/pomodoro/components/digital-clock";
import { LeaderboardModal } from "@/features/pomodoro/components/leaderboard-modal";
import { PomodoroHeader } from "@/features/pomodoro/components/pomodoro-header";
import { PomodoroTimer } from "@/features/pomodoro/components/pomodoro-timer";
import { TaskInput } from "@/features/pomodoro/components/task-input";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useRoomStore } from "@/stores/use-room-store";

export default function PomodoroPage() {
  const { setOpen } = useSidebar();
  const { currentRoom } = useRoomStore();
  const { activeView } = usePomodoroStore();

  // Hide sidebar when entering Pomodoro page for fullscreen experience
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  // Auto-restore current room or create/join personal room
  useEffect(() => {
    if (!currentRoom) {
      const initRoom = async () => {
        const { restoreCurrentRoom } = useRoomStore.getState();
        await restoreCurrentRoom();
      };
      initRoom();
    }
  }, [currentRoom]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black">
      {/* Persistent Music Player */}
      <BackgroundMusicPlayer />

      {/* Background Scene */}
      <BackgroundScene />

      {/* Header & Social Overlays */}
      <PomodoroHeader />
      <LeaderboardModal />

      {/* Main Content Area */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-20 pb-32">
        <AnimatePresence mode="wait">
          {activeView === "focus" ? (
            <motion.div
              key="focus-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <PomodoroTimer />

              <div className="mt-8">
                <TaskInput className="w-[300px] sm:w-[400px]" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="timer-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <DigitalClock showSeconds={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Control Bar */}
      <div className="relative z-20">
        <ControlBar />
      </div>
    </div>
  );
}
