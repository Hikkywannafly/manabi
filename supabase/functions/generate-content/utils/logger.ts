import { LOGGING_CONFIG } from "../config.ts";

export class Logger {
  static info(message: string, data?: unknown) {
    if (!LOGGING_CONFIG.levels.info) return;
    console.log(
      `${LOGGING_CONFIG.emojis.info} ${message}`,
      data ? JSON.stringify(data, null, 2) : "",
    );
  }

  static success(message: string, data?: unknown) {
    if (!LOGGING_CONFIG.levels.success) return;
    console.log(
      `${LOGGING_CONFIG.emojis.success} ${message}`,
      data ? JSON.stringify(data, null, 2) : "",
    );
  }

  static error(message: string, error?: unknown) {
    if (!LOGGING_CONFIG.levels.error) return;
    console.error(`${LOGGING_CONFIG.emojis.error} ${message}`, error);
  }

  static step(step: number, message: string) {
    console.log(`\n${LOGGING_CONFIG.emojis.step} STEP ${step}: ${message}`);
  }

  static celebrate(message: string) {
    console.log(`${LOGGING_CONFIG.emojis.celebrate} ${message}`);
  }

  static boom(message: string) {
    console.error(`${LOGGING_CONFIG.emojis.boom} ${message}`);
  }
}
