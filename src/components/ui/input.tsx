import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-9 w-full min-w-0 rounded-md border font-medium text-sm shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "border-input bg-transparent px-3 py-1 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30",
        outline:
          "border border-input shadow-xs focus-visible:border-ring focus-visible:ring-[1px] focus-visible:ring-ring/50 dark:border-input dark:bg-input/20",
        filled:
          "border-0 bg-accent/10 px-3 py-2 focus-visible:ring-[3px] focus-visible:ring-accent/20 dark:bg-accent/20",
        ghost:
          "border-transparent bg-transparent focus-visible:ring-[3px] focus-visible:ring-accent/30",
      },
      size: {
        default: "h-9 px-3 py-1",
        sm: "h-8 px-2.5 py-1 text-xs",
        lg: "h-10 px-4 py-2",
        xl: "h-12 px-4 py-2.5 text-base",
      },
      state: {
        default: "",
        error:
          "border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        success: "border-green-500 focus-visible:ring-green-500/20",
        warning: "border-amber-500 focus-visible:ring-amber-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  },
);

function Input({
  className,
  type,
  variant,
  size,
  state,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({
          variant: variant || "default",
          size: size || "default",
          state: state || "default",
          className,
        }),
      )}
      {...props}
    />
  );
}

export { Input, inputVariants };
