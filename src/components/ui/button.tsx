import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all duration-200 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:bg-primary/80 dark:bg-primary dark:active:bg-primary/70 dark:hover:bg-primary/80",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-md focus-visible:ring-destructive/20 active:bg-destructive/80 dark:bg-destructive/80 dark:active:bg-destructive/60 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/70",
        outline:
          "border bg-background shadow-xs hover:border-accent hover:bg-accent/50 hover:shadow-sm active:bg-accent/70 dark:border-input dark:bg-input/20 dark:active:bg-accent/50 dark:hover:border-accent/60 dark:hover:bg-accent/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow active:bg-secondary/70 dark:bg-secondary dark:active:bg-secondary/70 dark:hover:bg-secondary/80",
        ghost:
          "hover:bg-accent/50 active:bg-accent/70 dark:active:bg-accent/40 dark:hover:bg-accent/30",
        link: "text-primary underline-offset-4 hover:text-primary/80 hover:underline active:text-primary/70 dark:text-primary dark:active:text-primary/80 dark:hover:text-primary/90",
        gradient:
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md hover:from-primary/90 hover:to-primary/70 hover:shadow-lg active:shadow-sm dark:from-primary dark:to-primary/70 dark:hover:from-primary/80 dark:hover:to-primary/60",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      disableAnimations: {
        true: "transition-none active:scale-100",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disableAnimations: false,
    },
  },
);

function Button({
  className,
  variant,
  size,
  disableAnimations,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, disableAnimations, className }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
