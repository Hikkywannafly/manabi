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

  notifyError("Error", errorMessage);
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
