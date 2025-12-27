"use client";

import { Clock } from "lucide-react";

export function StudyTimeWidget() {
  return (
    <div className="mb-4 rounded-lg border bg-secondary p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-medium text-muted-foreground text-sm">
            Study Time
          </p>
          <div className="mt-1">
            <p className="font-semibold text-foreground text-xl tracking-tight">
              Today: 0m
            </p>
            <p className="font-semibold text-muted-foreground text-xl tracking-tight">
              Yesterday: 18s
            </p>
          </div>
        </div>
        <div className="rounded-md bg-primary/10 p-2">
          <Clock className="size-5 text-primary" />
        </div>
      </div>
      <p className="mt-1 text-orange-600 text-xs">
        Aim to beat yesterday&apos;s 18s today!
      </p>
    </div>
  );
}
