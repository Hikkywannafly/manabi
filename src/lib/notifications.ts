import type { ExternalToast } from "sonner";
import { toast } from "sonner";

/**
 * Notification module for handling success, error, and info notifications
 * Built on top of Sonner toast library
 */

/**
 * Show a success notification
 * @param message - The main message to display
 * @param options - Additional toast options
 */
export function notifySuccess(message: string, options?: ExternalToast) {
  return toast.success(message, {
    duration: 4000,
    ...options,
  });
}

/**
 * Show an error notification
 * @param message - The main message to display
 * @param description - Additional description or error details
 * @param options - Additional toast options
 */
export function notifyError(
  message: string,
  description?: string,
  options?: ExternalToast,
) {
  return toast.error(message, {
    description: description,
    duration: 5000,
    ...options,
  });
}

/**
 * Show an info notification
 * @param message - The main message to display
 * @param description - Additional description
 * @param options - Additional toast options
 */
export function notifyInfo(
  message: string,
  description?: string,
  options?: ExternalToast,
) {
  return toast.info(message, {
    description: description,
    duration: 4000,
    ...options,
  });
}

/**
 * Show a warning notification
 * @param message - The main message to display
 * @param description - Additional description
 * @param options - Additional toast options
 */
export function notifyWarning(
  message: string,
  description?: string,
  options?: ExternalToast,
) {
  return toast.warning(message, {
    description: description,
    duration: 4000,
    ...options,
  });
}

/**
 * Show a loading/promise notification
 * Useful for async operations
 * @param promise - The promise to track
 * @param messages - Messages for loading, success, and error states
 */
export function notifyPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error?: string;
  },
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error || "Something went wrong",
  });
}

/**
 * Dismiss a notification by ID
 * @param toastId - The ID of the toast to dismiss
 */
export function dismissNotification(toastId?: string | number) {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
}

/**
 * Dismiss all notifications
 */
export function dismissAllNotifications() {
  toast.dismiss();
}

/**
 * Custom error handler that shows error notification
 * Useful for API responses and error handling
 * @param error - The error object or message
 * @param defaultMessage - Default message if error doesn't have a message
 */
export function handleErrorNotification(
  error: unknown,
  defaultMessage: string = "Something went wrong",
) {
  let errorMessage = defaultMessage;

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;
    if ("message" in errorObj && typeof errorObj.message === "string") {
      errorMessage = errorObj.message;
    }
  }

  // Transform technical error messages into user-friendly ones
  const friendlyMessage = transformErrorMessage(errorMessage, defaultMessage);

  notifyError("Error", friendlyMessage);
}

/**
 * Transform technical error messages into user-friendly messages
 * @param errorMessage - The raw error message
 * @param defaultMessage - Fallback message
 * @returns User-friendly error message
 */
function transformErrorMessage(
  errorMessage: string,
  defaultMessage: string,
): string {
  // RLS (Row Level Security) errors
  if (errorMessage.includes("row-level security policy")) {
    return "You don't have permission to perform this action. Please check your account settings.";
  }

  // Foreign key constraint errors
  if (errorMessage.includes("foreign key constraint")) {
    return "This action cannot be completed because it would break data relationships.";
  }

  // Unique constraint errors
  if (
    errorMessage.includes("unique constraint") ||
    errorMessage.includes("duplicate key")
  ) {
    return "This item already exists. Please use a different name or value.";
  }

  // Network errors
  if (
    errorMessage.includes("Failed to fetch") ||
    errorMessage.includes("Network request failed") ||
    errorMessage.includes("NetworkError")
  ) {
    return "Network error. Please check your internet connection and try again.";
  }

  // Authentication errors
  if (
    errorMessage.includes("not authenticated") ||
    errorMessage.includes("invalid token") ||
    errorMessage.includes("JWT")
  ) {
    return "Your session has expired. Please sign in again.";
  }

  // Timeout errors
  if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
    return "The request took too long. Please try again.";
  }

  // If no pattern matches, return the default message
  // This prevents showing raw technical errors to users
  return defaultMessage;
}

/**
 * Custom success handler for showing success notifications
 * @param message - The success message to display
 * @param description - Optional description
 */
export function handleSuccessNotification(
  message: string,
  description?: string,
) {
  if (description) {
    toast.success(message, { description });
  } else {
    notifySuccess(message);
  }
}
