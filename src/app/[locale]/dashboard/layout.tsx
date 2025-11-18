import { ErrorBoundary } from "@/components/error-boundary";
import { DashboardHeader } from "@/components/layouts";
import AppSidebar from "@/components/layouts/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          {/* App Sidebar */}
          <AppSidebar />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Dashboard Header */}
            <DashboardHeader />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
