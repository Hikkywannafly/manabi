/**
 * Global Timer Engine Singleton
 *
 * This module provides a global timer engine that persists across route changes.
 * The timer continues running even when the user navigates away from the Pomodoro page.
 */

import { TimerEngine, type TimerEvent } from "../engines/timer-engine";

// Global singleton instance
let globalEngine: TimerEngine | null = null;

/**
 * Get the global timer engine instance.
 * Creates a new instance if one doesn't exist.
 */
export function getGlobalTimerEngine(): TimerEngine {
  if (typeof window === "undefined") {
    // Return a dummy for SSR
    return new TimerEngine();
  }

  if (!globalEngine) {
    globalEngine = new TimerEngine();
  }
  return globalEngine;
}

/**
 * Subscribe to global timer events.
 * Returns an unsubscribe function.
 */
export function subscribeToGlobalTimer(
  callback: (event: TimerEvent) => void,
): () => void {
  const engine = getGlobalTimerEngine();
  return engine.on(callback);
}

/**
 * Start the global timer with a given duration in seconds.
 */
export function startGlobalTimer(durationSeconds: number): void {
  const engine = getGlobalTimerEngine();
  engine.start(durationSeconds);
}

/**
 * Pause the global timer.
 */
export function pauseGlobalTimer(): void {
  const engine = getGlobalTimerEngine();
  engine.pause();
}

/**
 * Resume the global timer.
 */
export function resumeGlobalTimer(): void {
  const engine = getGlobalTimerEngine();
  engine.resume();
}

/**
 * Stop the global timer.
 */
export function stopGlobalTimer(): void {
  const engine = getGlobalTimerEngine();
  engine.stop();
}
