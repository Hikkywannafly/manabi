"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DigitalClockProps {
  className?: string;
  format?: "12h" | "24h";
  showDate?: boolean;
  showSeconds?: boolean;
}

export function DigitalClock({
  className,
  format = "24h",
  showDate = true,
  showSeconds = true,
}: DigitalClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = format === "12h" ? time.getHours() % 12 || 12 : time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      {/* Main Digital Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        {/* Time Display */}
        <div className="flex items-center gap-2">
          {/* Hours */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="font-bold text-[8rem] text-white leading-none tracking-tighter drop-shadow-2xl sm:text-[10rem] md:text-[12rem]"
          >
            {String(hours).padStart(2, "0")}
          </motion.div>

          {/* Colon Separator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.4,
            }}
            className="font-bold text-[8rem] text-white leading-none tracking-tighter drop-shadow-2xl sm:text-[10rem] md:text-[12rem]"
          >
            :
          </motion.div>

          {/* Minutes */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-bold text-[8rem] text-white leading-none tracking-tighter drop-shadow-2xl sm:text-[10rem] md:text-[12rem]"
          >
            {String(minutes).padStart(2, "0")}
          </motion.div>

          {/* AM/PM Indicator (12h format) */}
          {format === "12h" && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="ml-4 font-bold text-4xl text-white/60 sm:text-5xl md:text-6xl"
            >
              {ampm}
            </motion.div>
          )}
        </div>

        {/* Seconds Display */}
        {showSeconds && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="font-medium text-4xl text-white/40 sm:text-5xl"
          >
            {String(seconds).padStart(2, "0")}
          </motion.div>
        )}
      </motion.div>

      {/* Date Display */}
      {showDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-white/60 text-xl sm:text-2xl">
            {time.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex items-center gap-4 text-sm text-white/40"
          >
            <span>Week {getWeekNumber(time)}</span>
            <span>•</span>
            <span>Day {getDayOfYear(time)}</span>
          </motion.div>
        </motion.div>
      )}

      {/* Decorative Elements */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
        className="h-1 w-64 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  );
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Helper function to get day of year
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
