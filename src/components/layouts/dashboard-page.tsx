import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardPageProps {
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  description?: string;
  title?: string;
}

export function DashboardPage({
  children,
  className,
  headerAction,
  description,
  title,
}: DashboardPageProps) {
  return (
    <div className="flex flex-col">
      <div className="my-8 px-4 xl:px-8">
        <div className="container mx-auto max-w-7xl p-0">
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                {title && <h1 className="mb-2 font-bold text-2xl">{title}</h1>}
                {description && (
                  <p className="mb-6 text-muted-foreground">{description}</p>
                )}
              </div>
              {headerAction && (
                <div className="flex items-center gap-2">{headerAction}</div>
              )}
            </div>
            <div className={cn("", className)}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
