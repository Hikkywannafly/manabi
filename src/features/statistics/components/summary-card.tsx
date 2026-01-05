import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtext?: string;
  progress?: number;
  gradient: string;
  extra?: React.ReactNode;
}

export function SummaryCard({
  title,
  icon,
  value,
  subtext,
  progress,
  gradient,
  extra,
}: SummaryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-secondary text-card-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg">
      <div className="flex flex-row items-center justify-between space-y-0 p-3 pb-2 sm:p-6 sm:pb-2">
        <h3 className="flex items-center gap-1 font-medium text-xs tracking-tight sm:text-sm">
          <span className="truncate">{title}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3 shrink-0 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>More info about {title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <div className="size-4 shrink-0">{icon}</div>
      </div>
      <div className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="font-bold text-lg sm:text-2xl">
          <div className="flex items-baseline gap-2">{value}</div>
        </div>
        {subtext && (
          <div className="mt-2 text-[10px] text-muted-foreground sm:text-xs">
            {subtext}
          </div>
        )}
        {progress !== undefined && (
          <div className="mt-2">
            <div className="relative">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary transition-all sm:h-2">
                <div
                  className="size-full flex-1 bg-primary transition-all"
                  style={{ transform: `translateX(-${100 - progress}%)` }}
                />
              </div>
            </div>
          </div>
        )}
        {extra}
        <div
          className={`-bottom-6 -right-6 sm:-bottom-8 sm:-right-8 absolute size-20 rounded-full bg-gradient-to-br transition-transform group-hover:scale-110 sm:size-24 ${gradient}`}
        />
      </div>
    </div>
  );
}
