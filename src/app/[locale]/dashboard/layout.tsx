"use client";

import { usePathname } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { DashboardHeader } from "@/components/layouts";
import AppSidebar from "@/components/layouts/app-sidebar";
import { PomodoroMiniTimer } from "@/features/pomodoro/components";
import { useTimerStore } from "@/stores/use-timer-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPomodoroPage = pathname?.includes("/pomodoro");
  const isQuizTakePage =
    pathname?.includes("/quiz/") && pathname?.includes("/take");
  const timerStatus = useTimerStore((s) => s.status);

  // Show mini timer when user is not on pomodoro page and timer is active
  const showMiniTimer = !isPomodoroPage && timerStatus !== "idle";

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full overflow-hidden">
        {/* App Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Dashboard Header - Hidden on Pomodoro page */}
          {!isPomodoroPage && <DashboardHeader />}

          {/* Main Content */}
          <main
            className={`flex-1 ${
              isPomodoroPage || isQuizTakePage
                ? "overflow-hidden"
                : "overflow-y-auto bg-background"
            }`}
          >
            {children}
          </main>
        </div>

        {/* Pomodoro Mini Timer - Floating PiP */}
        {showMiniTimer && <PomodoroMiniTimer />}
      </div>
    </ErrorBoundary>
  );
}
