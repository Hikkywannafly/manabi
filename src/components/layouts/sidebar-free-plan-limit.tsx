"use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";

export function SidebarFreePlanLimit() {
  return (
    <div className="mt-auto hidden group-data-[collapsible=icon]:hidden md:block">
      {/* <div className="text-foreground shadow-lg">
        <div className="space-y-4 rounded-xl bg-secondary p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Free Plan Limit</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>2 / 3</span>
              <span className="text-muted-foreground">Quizzes per week</span>
            </div>
            <div
              aria-valuemax={100}
              aria-valuemin={0}
              role="progressbar"
              data-state="indeterminate"
              data-max={100}
              className="relative h-2 w-full overflow-hidden rounded-full bg-background"
            >
              <div
                data-state="indeterminate"
                data-max={100}
                className="size-full flex-1 bg-primary transition-all"
                style={{ transform: "translateX(-33.3333%)" }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>0 / 3</span>
              <span className="text-muted-foreground">Flashcards per week</span>
            </div>
            <div
              aria-valuemax={100}
              aria-valuemin={0}
              role="progressbar"
              data-state="indeterminate"
              data-max={100}
              className="relative h-2 w-full overflow-hidden rounded-full bg-background"
            >
              <div
                data-state="indeterminate"
                data-max={100}
                className="size-full flex-1 bg-primary transition-all"
                style={{ transform: "translateX(-100%)" }}
              />
            </div>
          </div>
          <Link href="/dashboard/billing">
            <Button
              className="mt-2 h-10 w-full rounded-2xl px-4 py-2 font-medium text-primary-foreground text-sm"
            >
              Increase Limit
            </Button>
          </Link>
        </div>
      </div> */}
    </div>
  );
}
