import type React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  variant?: "default" | "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  centered?: boolean;
}

export function Container({
  children,
  variant = "default",
  className,
  centered = false,
}: ContainerProps) {
  const variants = {
    default: "container mx-auto px-4",
    sm: "container mx-auto max-w-2xl px-4",
    md: "container mx-auto max-w-4xl px-4",
    lg: "container mx-auto max-w-6xl px-4",
    xl: "container mx-auto max-w-7xl px-4",
    full: "w-full px-4",
  };

  return (
    <div
      className={cn(
        variants[variant],
        centered && "flex items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
