import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface PresenceState {
  user_id: string;
  username: string;
  avatar_url?: string;
  status: "focusing" | "break" | "idle";
  online_at: string;
}

export interface RoomBroadcast {
  type: "timer_start" | "timer_pause" | "timer_complete" | "status_change";
  user_id: string;
  data?: any;
}

/**
 * Subscribe to a room's presence channel
 */
export function subscribeToRoom(
  roomId: string,
  callbacks: {
    onSync?: (users: PresenceState[]) => void;
    onJoin?: (user: PresenceState) => void;
    onLeave?: (user: PresenceState) => void;
    onBroadcast?: (payload: RoomBroadcast) => void;
  },
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase.channel(`room:${roomId}`, {
    config: {
      presence: {
        key: "user_id",
      },
      broadcast: {
        self: false,
      },
    },
  });

  // Handle presence sync
  if (callbacks.onSync) {
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users: PresenceState[] = [];

      Object.keys(state).forEach((key) => {
        const presences = state[key];
        if (presences && presences.length > 0) {
          users.push(presences[0] as unknown as PresenceState);
        }
      });

      callbacks.onSync?.(users);
    });
  }

  // Handle user join
  if (callbacks.onJoin) {
    channel.on("presence", { event: "join" }, ({ newPresences }) => {
      newPresences.forEach((presence) => {
        callbacks.onJoin?.(presence as unknown as PresenceState);
      });
    });
  }

  // Handle user leave
  if (callbacks.onLeave) {
    channel.on("presence", { event: "leave" }, ({ leftPresences }) => {
      leftPresences.forEach((presence) => {
        callbacks.onLeave?.(presence as unknown as PresenceState);
      });
    });
  }

  // Handle broadcasts
  if (callbacks.onBroadcast) {
    channel.on("broadcast", { event: "room_event" }, ({ payload }) => {
      callbacks.onBroadcast?.(payload as RoomBroadcast);
    });
  }

  return channel;
}

/**
 * Track user presence in a room
 */
export async function trackPresence(
  channel: RealtimeChannel,
  presence: PresenceState,
): Promise<void> {
  await channel.track(presence);
}

/**
 * Update user presence status
 */
export async function updatePresenceStatus(
  channel: RealtimeChannel,
  userId: string,
  status: "focusing" | "break" | "idle",
): Promise<void> {
  const state = channel.presenceState();
  const presenceArray = state[userId];

  if (presenceArray && presenceArray.length > 0) {
    const currentPresence = presenceArray[0] as unknown as PresenceState;

    await channel.track({
      ...currentPresence,
      status,
      online_at: new Date().toISOString(),
    });
  }
}

/**
 * Broadcast an event to room participants
 */
export async function broadcastToRoom(
  channel: RealtimeChannel,
  event: RoomBroadcast,
): Promise<void> {
  await channel.send({
    type: "broadcast",
    event: "room_event",
    payload: event,
  });
}

/**
 * Unsubscribe from a room
 */
export async function unsubscribeFromRoom(
  channel: RealtimeChannel,
): Promise<void> {
  await channel.untrack();
  await channel.unsubscribe();
}

/**
 * Get current room participants
 */
export function getRoomParticipants(channel: RealtimeChannel): PresenceState[] {
  const state = channel.presenceState();
  const users: PresenceState[] = [];

  Object.keys(state).forEach((key) => {
    const presences = state[key];
    if (presences && presences.length > 0) {
      users.push(presences[0] as unknown as PresenceState);
    }
  });

  return users;
}
