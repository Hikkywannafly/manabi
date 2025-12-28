"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Participant {
  user_id: string;
  username: string;
  avatar_url?: string;
  status: "focusing" | "break" | "idle";
  presence_ref?: string;
}

interface RoomPresenceProps {
  roomId: string;
  className?: string;
}

export function RoomPresence({ roomId, className }: RoomPresenceProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const supabase = createClient();
    let presenceChannel: RealtimeChannel;

    const setupPresence = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname, avatar_url")
        .eq("id", user.id)
        .single();

      // Subscribe to room presence
      presenceChannel = supabase.channel(`room:${roomId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      // Track presence
      presenceChannel
        .on("presence", { event: "sync" }, () => {
          const state = presenceChannel.presenceState();
          const users: Participant[] = [];

          Object.keys(state).forEach((key) => {
            const presences = state[key];
            if (presences && presences.length > 0) {
              const presence = presences[0] as any;
              users.push({
                user_id: key,
                username: presence.username || presence.nickname || "Anonymous",
                avatar_url: presence.avatar_url,
                status: presence.status || "idle",
                presence_ref: presence.presence_ref,
              });
            }
          });

          setParticipants(users);
        })
        .on("presence", { event: "join" }, () => {
          // User joined
        })
        .on("presence", { event: "leave" }, () => {
          // User left
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            // Track current user's presence
            await presenceChannel.track({
              user_id: user.id,
              nickname: profile?.nickname || "Anonymous",
              avatar_url: profile?.avatar_url,
              status: "idle",
              online_at: new Date().toISOString(),
            });
          }
        });

      setChannel(presenceChannel);
    };

    setupPresence();

    return () => {
      if (presenceChannel) {
        presenceChannel.unsubscribe();
      }
    };
  }, [roomId]);

  // Update status based on timer state
  // const updateStatus = async (status: "focusing" | "break" | "idle") => {
  //   if (!channel) return;

  //   const supabase = createClient();
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();
  //   if (!user) return;

  //   const { data: profile } = await supabase
  //     .from("profiles")
  //     .select("username, avatar_url")
  //     .eq("id", user.id)
  //     .single();

  //   await channel.track({
  //     user_id: user.id,
  //     username: profile?.username || "Anonymous",
  //     avatar_url: profile?.avatar_url,
  //     status,
  //     online_at: new Date().toISOString(),
  //   });
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "focusing":
        return "bg-red-500";
      case "break":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "focusing":
        return "Focusing";
      case "break":
        return "On Break";
      default:
        return "Idle";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-white/70" />
          <span className="font-medium text-white">
            {participants.length}{" "}
            {participants.length === 1 ? "Person" : "People"} Online
          </span>
        </div>
      </div>

      {/* Participants List */}
      <div className="space-y-2">
        {participants.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-sm text-white/50">
            No one is here yet. Be the first to join!
          </div>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.user_id}
              className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
            >
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={participant.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {participant.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* Status indicator */}
                <div
                  className={cn(
                    "absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-black",
                    getStatusColor(participant.status),
                  )}
                />
              </div>

              {/* User info */}
              <div className="flex-1">
                <p className="font-medium text-sm text-white">
                  {participant.username}
                </p>
                <div className="flex items-center gap-1 text-white/50 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{getStatusLabel(participant.status)}</span>
                </div>
              </div>

              {/* Status badge */}
              <Badge
                variant="outline"
                className={cn(
                  "border-white/20 text-xs",
                  participant.status === "focusing" &&
                    "border-red-500/50 bg-red-500/10 text-red-500",
                  participant.status === "break" &&
                    "border-green-500/50 bg-green-500/10 text-green-500",
                  participant.status === "idle" &&
                    "border-gray-500/50 bg-gray-500/10 text-gray-500",
                )}
              >
                {getStatusLabel(participant.status)}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Export updateStatus for use in timer components
export { RoomPresence as default };
