"use client";

import { AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { rateLimiter } from "@/features/flashcards/utils/rate-limiter";

interface RateLimitAlertProps {
  limitKey: string;
  className?: string;
}

export function RateLimitAlert({ limitKey, className }: RateLimitAlertProps) {
  const [waitTime, setWaitTime] = useState(0);
  const [isLimited, setIsLimited] = useState(false);

  useEffect(() => {
    const checkRateLimit = () => {
      const allowed = rateLimiter.isAllowed(limitKey);
      const time = rateLimiter.getTimeUntilNextRequest(limitKey);

      setIsLimited(!allowed);
      setWaitTime(time);
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 1000);

    return () => clearInterval(interval);
  }, [limitKey]);

  if (!isLimited || waitTime === 0) {
    return null;
  }

  const seconds = Math.ceil(waitTime / 1000);

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Rate Limit Active</AlertTitle>
      <AlertDescription className="flex items-center gap-2">
        <Clock className="h-3 w-3" />
        Please wait {seconds} second{seconds !== 1 ? "s" : ""} before generating
        more flashcards.
      </AlertDescription>
    </Alert>
  );
}
