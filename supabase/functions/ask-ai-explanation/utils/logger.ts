import { LOGGING_CONFIG } from "../config.ts";

/**
 * Logger utility for consistent logging across the edge function
 */
export class Logger {
  static info(message: string, data?: unknown): void {
    console.log(`${LOGGING_CONFIG.emojis.info} ${message}`, data || "");
  }

  static success(message: string, data?: unknown): void {
    console.log(`${LOGGING_CONFIG.emojis.success} ${message}`, data || "");
  }

  static error(message: string, error?: unknown): void {
    console.error(`${LOGGING_CONFIG.emojis.error} ${message}`, error || "");
  }

  static warning(message: string, data?: unknown): void {
    console.warn(`${LOGGING_CONFIG.emojis.warning} ${message}`, data || "");
  }

  static rocket(message: string): void {
    console.log(`${LOGGING_CONFIG.emojis.rocket} ${message}`);
  }

  static celebrate(message: string): void {
    console.log(`${LOGGING_CONFIG.emojis.celebrate} ${message}`);
  }

  static boom(message: string): void {
    console.error(`${LOGGING_CONFIG.emojis.boom} ${message}`);
  }
}
