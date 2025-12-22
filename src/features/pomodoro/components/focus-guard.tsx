"use client";

import { AlertTriangle } from "lucide-react";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePomodoroSettings } from "@/stores/use-pomodoro-settings";
import { useTimerStore } from "@/stores/use-timer-store";

/**
 * FocusGuard - Prevents user from leaving Pomodoro page while timer is running
 * Uses Page Visibility API and Next.js Router events
 */
export function FocusGuard() {
  const { status, mode } = useTimerStore();
  const { settings } = usePomodoroSettings();

  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const isTimerActive = status === "running" && mode === "focus";

  // Handle tab visibility changes
  useEffect(() => {
    if (!(settings.warnOnTabSwitch && isTimerActive)) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);

        // Show notification if user switches tabs frequently
        if (tabSwitchCount >= 2) {
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("Stay Focused! 🎯", {
              body: "You're switching tabs frequently. Stay on track!",
              icon: "/icon.png",
            });
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [settings.warnOnTabSwitch, isTimerActive, tabSwitchCount]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Handle browser navigation (back/forward/close)
  useEffect(() => {
    if (!(settings.blockInternalNavigation && isTimerActive)) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [settings.blockInternalNavigation, isTimerActive]);

  // Handle internal navigation (Next.js router)
  useEffect(() => {
    if (!(settings.blockInternalNavigation && isTimerActive)) return;

    // Note: Next.js App Router doesn't have router events like Pages Router
    // We'll use a different approach with route interception
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link?.href && !link.href.includes("/dashboard/pomodoro")) {
        e.preventDefault();
        setPendingNavigation(link.href);
        setShowNavigationWarning(true);
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [settings.blockInternalNavigation, isTimerActive]);

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
    }
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };

  // Reset tab switch count when timer stops
  useEffect(() => {
    if (!isTimerActive) {
      setTabSwitchCount(0);
    }
  }, [isTimerActive]);

  return (
    <>
      {/* Navigation Warning Dialog */}
      <AlertDialog
        open={showNavigationWarning}
        onOpenChange={setShowNavigationWarning}
      >
        <AlertDialogContent className="border-white/10 bg-black/90 text-white backdrop-blur-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/20 p-3">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <AlertDialogTitle className="text-xl">
                Leave Focus Session?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-white/70">
              You have an active Pomodoro timer running. Leaving now will
              interrupt your focus session and you'll lose your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelNavigation}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Stay Focused
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmNavigation}
              className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
            >
              Leave Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tab Switch Warning Indicator */}
      {settings.warnOnTabSwitch && isTimerActive && tabSwitchCount > 0 && (
        <div className="fade-in slide-in-from-top-2 pointer-events-none fixed top-4 right-4 z-50 animate-in">
          <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-orange-500 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Tab switches: {tabSwitchCount} - Stay focused!</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
