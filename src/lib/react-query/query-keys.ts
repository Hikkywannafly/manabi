// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
  profiles: {
    all: ["profiles"] as const,
    detail: (userId: string) => [...queryKeys.profiles.all, userId] as const,
  },
  pomodoro: {
    all: ["pomodoro"] as const,
    stats: (userId: string) =>
      [...queryKeys.pomodoro.all, "stats", userId] as const,
  },
};
