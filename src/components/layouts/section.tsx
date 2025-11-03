import type React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  variant?: "default" | "muted" | "gradient" | "dark";
  className?: string;
  containerClassName?: string;
  id?: string;
}

export function Section({
  children,
  variant = "default",
  className,
  containerClassName,
  id,
}: SectionProps) {
  const variants = {
    default: "bg-background",
    muted: "bg-muted/30",
    gradient:
      "bg-gradient-to-b from-background via-background to-primary/5 dark:to-primary/10",
    dark: "bg-card",
  };

  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", variants[variant], className)}
    >
      <div className={cn("container mx-auto px-4", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
