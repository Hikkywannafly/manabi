/**
 * TimerEngine - Timestamp-based timer using Web Worker
 *
 * This engine ensures accurate timing by:
 * 1. Using Date.now() deltas instead of setInterval counting
 * 2. Running in a Web Worker to avoid main thread blocking
 * 3. Self-correcting on tab visibility changes
 */

type TimerStatus = "idle" | "running" | "paused";

export interface TimerState {
  status: TimerStatus;
  timeLeft: number; // seconds
  duration: number; // seconds
  targetEndTime: number | null; // timestamp
}

export type TimerEventType = "tick" | "complete" | "error";

export interface TimerEvent {
  type: TimerEventType;
  timeLeft: number;
  error?: string;
}

export class TimerEngine {
  private worker: Worker | null = null;
  private listeners: Set<(event: TimerEvent) => void> = new Set();
  private state: TimerState = {
    status: "idle",
    timeLeft: 0,
    duration: 0,
    targetEndTime: null,
  };

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof window === "undefined") return;

    const workerCode = `
      let timerId = null;

      self.onmessage = function(e) {
        const { type, payload } = e.data;

        if (type === 'START') {
          const { endTime } = payload;

          if (timerId) clearInterval(timerId);

          timerId = setInterval(() => {
            const now = Date.now();
            const timeLeft = Math.ceil((endTime - now) / 1000);

            if (timeLeft <= 0) {
              clearInterval(timerId);
              self.postMessage({ type: 'COMPLETE' });
            } else {
              self.postMessage({ type: 'TICK', payload: { timeLeft } });
            }
          }, 100); // Check every 100ms for responsiveness
        }
        else if (type === 'PAUSE' || type === 'STOP') {
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
        }
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.worker.onmessage = (e) => {
      const { type, payload } = e.data;

      if (type === "TICK") {
        this.state.timeLeft = payload.timeLeft;
        this.listeners.forEach((listener) => {
          listener({ type: "tick", timeLeft: this.state.timeLeft });
        });
      } else if (type === "COMPLETE") {
        this.state.status = "idle";
        this.state.timeLeft = 0;
        this.listeners.forEach((listener) => {
          listener({ type: "complete", timeLeft: 0 });
        });
      }
    };
  }

  /**
   * Start the timer with a given duration
   */
  start(durationSeconds: number) {
    if (!this.worker) {
      console.error("Worker not initialized");
      return;
    }

    const now = Date.now();
    this.state = {
      status: "running",
      timeLeft: durationSeconds,
      duration: durationSeconds,
      targetEndTime: now + durationSeconds * 1000,
    };

    this.worker.postMessage({
      type: "START",
      payload: {
        endTime: this.state.targetEndTime,
      },
    });
  }

  /**
   * Resume from paused state
   */
  resume() {
    if (this.state.status !== "paused" || !this.worker) {
      return;
    }

    const now = Date.now();
    this.state.status = "running";
    this.state.targetEndTime = now + this.state.timeLeft * 1000;

    this.worker.postMessage({
      type: "START",
      payload: {
        endTime: this.state.targetEndTime,
      },
    });
  }

  /**
   * Pause the timer
   */
  pause() {
    if (this.state.status !== "running" || !this.worker) {
      return;
    }

    this.state.status = "paused";
    this.worker.postMessage({ type: "PAUSE" });
  }

  /**
   * Stop and reset the timer
   */
  stop() {
    if (!this.worker) {
      return;
    }

    this.state = {
      status: "idle",
      timeLeft: 0,
      duration: 0,
      targetEndTime: null,
    };

    this.worker.postMessage({ type: "STOP" });
  }

  /**
   * Get current state
   */
  getState(): TimerState {
    return { ...this.state };
  }

  /**
   * Subscribe to timer events
   */
  on(callback: (event: TimerEvent) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Cleanup
   */
  destroy() {
    this.worker?.terminate();
    this.worker = null;
    this.listeners.clear();
  }
}
