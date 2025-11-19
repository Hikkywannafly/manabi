import { Shell } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  textClassName?: string;
  showText?: boolean;
}

export function Logo({
  size = "md",
  className,
  textClassName,
  showText = true,
}: LogoProps) {
  const sizes = {
    sm: {
      container: "h-8 w-8",
      icon: "h-4 w-4",
      text: "text-xl",
    },
    md: {
      container: "h-10 w-10",
      icon: "h-6 w-6",
      text: "text-2xl",
    },
    lg: {
      container: "h-12 w-12",
      icon: "h-7 w-7",
      text: "text-3xl",
    },
  };

  const currentSize = sizes[size];

  return (
    <Link href="/" className={cn("group flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary/10",
          currentSize.container,
        )}
      >
        <Shell className={cn("text-primary", currentSize.icon)} />
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold text-foreground transition-colors group-hover:text-primary",
            currentSize.text,
            textClassName,
          )}
        >
          Manabi
        </span>
      )}
    </Link>
  );
}
