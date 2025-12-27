"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function WrappedBanner() {
  return (
    <div className="mb-4">
      <Link
        href="/dashboard/wrapped"
        className="group relative block h-64 w-full max-w-lg cursor-pointer overflow-hidden rounded-3xl border border-border bg-secondary shadow-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]"
      >
        <div
          className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute top-0 right-0 size-[300px] translate-x-1/3 rounded-full bg-gradient-to-b from-foreground/10 to-transparent blur-[80px] transition-all duration-500 group-hover:from-foreground/15"
          style={{
            transform: "translateX(33%) translateY(-33%)",
          }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-0 z-0 w-[200%] select-none opacity-[0.03] transition-opacity group-hover:opacity-[0.06]"
          style={{
            transform: "translateY(-50%) rotate(-5deg)",
          }}
        >
          <div className="flex animate-scroll whitespace-nowrap">
            <span className="mr-8 font-black text-9xl italic tracking-tighter">
              WRAPPED 2025
            </span>
            <span className="mr-8 font-black text-9xl italic tracking-tighter">
              WRAPPED 2025
            </span>
            <span className="mr-8 font-black text-9xl italic tracking-tighter">
              WRAPPED 2025
            </span>
            <span className="mr-8 font-black text-9xl italic tracking-tighter">
              WRAPPED 2025
            </span>
          </div>
        </div>
        <div className="relative z-20 flex h-full flex-col justify-between p-8">
          <div className="flex items-start justify-end">
            <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-background shadow-foreground/20 shadow-lg transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
              <ArrowUpRight className="size-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="font-black text-4xl text-foreground tracking-tighter drop-shadow-xl transition-transform group-hover:translate-x-1 md:text-5xl">
              2025 <br />
              <span className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                UNWRAPPED
              </span>
            </h2>
          </div>
          <div className="mt-auto flex items-center gap-6">
            <div>
              <div className="mb-0.5 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                Focus Time
              </div>
              <div className="font-bold font-mono text-foreground text-lg">
                0<span className="text-muted-foreground/60 text-sm">h</span>
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="mb-0.5 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                Top %
              </div>
              <div className="font-bold font-mono text-foreground text-lg">
                8%
              </div>
            </div>
          </div>
        </div>
        <div className="shine-effect pointer-events-none absolute inset-0 z-30" />
      </Link>
    </div>
  );
}
