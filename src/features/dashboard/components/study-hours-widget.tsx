"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StudyHoursWidget() {
  const current = 0;
  const target = 10;

  return (
    <div className="rounded-md bg-background/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="truncate font-medium text-sm">Study Hours</span>
        <span className="shrink-0 text-muted-foreground text-xs">
          {current}/{target}
        </span>
      </div>

      {/* Needs a progress bar here if we follow the original HTML implicitly,
          but the HTML snippet structure for this specific part is nested inside Study Plans container
          in the source HTML. Separating it for modularity.
      */}

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Quick Add:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-2xl px-2 text-xs"
          >
            <Plus className="mr-1 size-3" />
            0.5
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-2xl px-2 text-xs"
          >
            <Plus className="mr-1 size-3" />1
          </Button>
          <span className="text-muted-foreground text-xs">hours</span>
        </div>
      </div>
    </div>
  );
}
