"use client";

import { usePathname } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { DashboardHeader } from "@/components/layouts";
import AppSidebar from "@/components/layouts/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPomodoroPage = pathname?.includes("/pomodoro");

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* App Sidebar */}
          <AppSidebar />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col">
            {/* Dashboard Header - Hidden on Pomodoro page */}
            {!isPomodoroPage && <DashboardHeader />}

            {/* Main Content */}
            <main
              className={`flex-1 ${
                isPomodoroPage
                  ? "overflow-hidden"
                  : "overflow-y-auto bg-background p-4 md:p-6 lg:p-8"
              }`}
            >
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
