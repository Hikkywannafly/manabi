import { useCallback, useState, useTransition } from "react";

interface AuthActionResult<T = unknown> {
  error?: string;
  data?: T;
}

export function useAuthAction<T = unknown>() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (action: () => Promise<AuthActionResult<T>>): Promise<T | null> => {
      setError(null);

      return new Promise<T | null>((resolve) => {
        startTransition(async () => {
          try {
            const result = await action();

            if (!result) {
              resolve(null);
              return;
            }

            if (result.error) {
              setError(result.error);
              resolve(null);
            } else {
              resolve(result.data ?? null);
            }
          } catch (err) {
            if (err && typeof err === "object" && "digest" in err) {
              const digest = (err as { digest?: string }).digest;
              if (digest?.includes("NEXT_REDIRECT")) {
                resolve(null);
                return;
              }
            }

            const errorMessage =
              err instanceof Error
                ? err.message
                : "An unexpected error occurred";
            setError(errorMessage);
            resolve(null);
          }
        });
      });
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    execute,
    isPending,
    error,
    setError,
    clearError,
  };
}
