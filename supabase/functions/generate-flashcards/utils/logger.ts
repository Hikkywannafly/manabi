import { LOGGING_CONFIG } from "../config.ts";

export class Logger {
  private static prefix = "[generate-flashcards]";

  static info(message: string, data?: unknown) {
    if (!LOGGING_CONFIG.enabled) return;
    console.log(
      `${LOGGING_CONFIG.emojis.info} ${Logger.prefix} ${message}`,
      data ? JSON.stringify(data, null, 2) : "",
    );
  }

  static success(message: string, data?: unknown) {
    if (!LOGGING_CONFIG.enabled) return;
    console.log(
      `${LOGGING_CONFIG.emojis.checkmark} ${Logger.prefix} ${message}`,
      data ? JSON.stringify(data, null, 2) : "",
    );
  }

  static error(message: string, error?: unknown) {
    console.error(
      `${LOGGING_CONFIG.emojis.boom} ${Logger.prefix} ${message}`,
      error,
    );
  }

  static warning(message: string, data?: unknown) {
    if (!LOGGING_CONFIG.enabled) return;
    console.warn(
      `${LOGGING_CONFIG.emojis.warning} ${Logger.prefix} ${message}`,
      data ? JSON.stringify(data, null, 2) : "",
    );
  }

  static celebrate(message: string) {
    console.log(`${LOGGING_CONFIG.emojis.rocket} ${Logger.prefix} ${message}`);
  }

  static boom(message: string) {
    console.error(`${LOGGING_CONFIG.emojis.boom} ${Logger.prefix} ${message}`);
  }
}
