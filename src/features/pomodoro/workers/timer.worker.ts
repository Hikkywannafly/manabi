/* eslint-disable no-restricted-globals */

/**
 * Timestamp-based Timer Worker
 *
 * Uses Date.now() to calculate remaining time, preventing drift
 * and handling background tabs correctly.
 */

let timerInterval: NodeJS.Timeout | null = null;
let targetEndTime: number | null = null;

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === "START") {
    const { endTime } = payload;
    targetEndTime = endTime;

    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Heartbeat every 100ms for smooth UI updates
    timerInterval = setInterval(() => {
      if (!targetEndTime) {
        return;
      }

      const now = Date.now();
      const remainingMs = Math.max(0, targetEndTime - now);
      const timeLeft = Math.ceil(remainingMs / 1000);

      self.postMessage({
        type: "TICK",
        payload: { timeLeft },
      });

      if (remainingMs <= 0) {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        targetEndTime = null;
        self.postMessage({ type: "COMPLETE" });
      }
    }, 100); // 100ms for smooth updates
  } else if (type === "PAUSE" || type === "STOP") {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    targetEndTime = null;
  }
};
