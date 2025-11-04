import type React from "react";
import { Footer } from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  variant?: "default" | "centered" | "gradient" | "full";
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  containerClassName?: string;
}

export function PageLayout({
  children,
  variant = "default",
  className,
  showHeader = true,
  showFooter = false,
  containerClassName,
}: PageLayoutProps) {
  const variants = {
    default: "min-h-screen bg-background",
    centered:
      "relative flex min-h-screen items-center justify-center bg-background px-4 py-12",
    gradient:
      "relative flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-primary/5 px-4 py-12",
    full: "min-h-screen",
  };

  return (
    <div className={cn(variants[variant], className)}>
      {showHeader && <Header />}
      <main className={cn("flex-1", containerClassName)}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
