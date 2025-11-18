/**
 * Timing constants for the application
 * Centralized to avoid magic numbers and improve maintainability
 */
export const TIMING = {
  /**
   * Delay after profile update to ensure database replication
   * Used in onboarding completion flow
   */
  PROFILE_REFRESH_DELAY: 300,

  /**
   * Debounce delay for search inputs
   */
  DEBOUNCE_SEARCH: 300,

  /**
   * Default toast notification duration
   */
  TOAST_DURATION: 3000,

  /**
   * Delay before retrying failed requests
   */
  RETRY_DELAY: 1000,
} as const;
