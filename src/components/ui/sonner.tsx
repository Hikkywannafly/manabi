"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // Explicit colors for types
          success:
            "!bg-emerald-100 !text-emerald-950 !border-emerald-300 dark:!bg-emerald-900/90 dark:!text-emerald-50 dark:!border-emerald-700",
          error:
            "!bg-red-600  !border-red-300 dark:!bg-red-900/90 dark:!text-red-50 dark:!border-red-700",
          warning:
            "!bg-amber-100 !text-amber-950 !border-amber-300 dark:!bg-amber-900/90 dark:!text-amber-50 dark:!border-amber-700",
          info: "!bg-blue-100 !text-blue-950 !border-blue-300 dark:!bg-blue-900/90 dark:!text-blue-50 dark:!border-blue-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
