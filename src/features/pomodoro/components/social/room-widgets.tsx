"use client";

import { Send, Share2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useRoomStore } from "@/stores/use-room-store";

interface RoomWidgetsProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function RoomWidgets({ isOpen = false, onToggle }: RoomWidgetsProps) {
  const { currentRoom } = useRoomStore();
  const [activeTab, setActiveTab] = useState<"chat" | "members">("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { user: string; text: string; id: string }[]
  >([]);
  const [members, setMembers] = useState<any[]>([]);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>("");

  // Ref to chat container for auto-scroll
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  // Get current user nickname
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .single();
        setCurrentUserNickname(
          profile?.nickname || user.email?.split("@")[0] || "",
        );
      }
    };
    getCurrentUser();
  }, []);

  // Clear messages when room changes
  useEffect(() => {
    setMessages([]);
  }, []);

  // Fetch and subscribe to members
  useEffect(() => {
    const roomId = currentRoom?.id;
    if (!roomId) return;

    const supabase = createClient();

    // Initial fetch
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("room_users")
        .select(`
          user_id,
          status,
          profile:profiles(nickname, avatar_url)
        `)
        .eq("room_id", roomId);

      if (data) {
        setMembers(data);
      }
      if (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`room_users:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${roomId}`,
        },
        (_payload) => {
          // Refetch members on any change
          fetchMembers();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom?.id]);

  // Subscribe to room updates (Chat & Presence)
  useEffect(() => {
    const roomId = currentRoom?.id;
    if (!roomId) return;

    const supabase = createClient();
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let heartbeatInterval: NodeJS.Timeout;

    const setupChannel = () => {
      const channel = supabase
        .channel(`room:${roomId}`, {
          config: {
            broadcast: { self: true }, // Receive own messages
            presence: { key: "" },
          },
        })
        .on("broadcast", { event: "chat" }, (payload) => {
          setMessages((prev) => [...prev, payload.payload]);
        })
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            reconnectAttempts = 0;

            // Start heartbeat to keep connection alive
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            heartbeatInterval = setInterval(() => {
              if (channelRef.current) {
                // Send a heartbeat ping
                channelRef.current.send({
                  type: "broadcast",
                  event: "heartbeat",
                  payload: { timestamp: Date.now() },
                });
              }
            }, 30000); // Every 30 seconds
          } else if (status === "CHANNEL_ERROR") {
            console.error("❌ Chat channel error:", err);

            // Try to reconnect
            if (reconnectAttempts < maxReconnectAttempts) {
              reconnectAttempts++;
              setTimeout(() => {
                supabase.removeChannel(channel);
                setupChannel();
              }, 1000 * reconnectAttempts);
            }
          } else if (status === "TIMED_OUT") {
            console.warn("⏱️ Chat channel timed out, reconnecting...");
            supabase.removeChannel(channel);
            setupChannel();
          } else if (status === "CLOSED") {
            if (heartbeatInterval) clearInterval(heartbeatInterval);
          }
        });

      channelRef.current = channel;
      return channel;
    };

    const channel = setupChannel();

    // Handle page visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if channel is still alive
        if (channelRef.current) {
          const currentChannel = channelRef.current;

          // Try to send a test message to check connection
          currentChannel
            .send({
              type: "broadcast",
              event: "ping",
              payload: { timestamp: Date.now() },
            })
            .then((response: string) => {
              if (response !== "ok") {
                console.warn("⚠️ Channel not responding, reconnecting...");
                supabase.removeChannel(currentChannel);
                setupChannel();
              }
            })
            .catch(() => {
              console.error("❌ Channel dead, reconnecting...");
              supabase.removeChannel(currentChannel);
              setupChannel();
            });
        } else {
          setupChannel();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (channel) {
        supabase.removeChannel(channel);
      }
      channelRef.current = null;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentRoom?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(message.trim() && currentRoom)) return;

    // Check if channel exists and is subscribed
    if (!channelRef.current) {
      console.error("Channel not initialized");
      toast.error("Chat not connected. Please refresh the page.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }

    // Get user profile for nickname
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .single();

    const newMessage = {
      user: profile?.nickname || user?.email?.split("@")[0] || "User",
      text: message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    // Clear input immediately for better UX
    const messageText = message;
    setMessage("");

    try {
      // Broadcast message using the existing channel
      const response = await channelRef.current.send({
        type: "broadcast",
        event: "chat",
        payload: newMessage,
      });

      // Check if send was successful
      if (response !== "ok") {
        console.warn("⚠️ Message send status:", response);
        // Restore message if failed
        setMessage(messageText);
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessage(messageText); // Restore message
      toast.error("Failed to send message. Please check your connection.");
    }
  };

  const activeMembers =
    members.length > 0 ? members : currentRoom?.room_users || [];

  if (!currentRoom) return null;

  return (
    <div className="fixed right-6 bottom-24 z-40 flex flex-col items-end gap-4">
      {/* Expanded Widget */}
      {isOpen && (
        <div className="slide-in-from-bottom-5 flex h-[400px] w-[320px] animate-in flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-white/10 border-b bg-white/5 p-4">
            <div className="flex gap-1 rounded-lg bg-black/40 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "rounded-md px-3 py-1 font-bold text-xs transition-all",
                  activeTab === "chat"
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white",
                )}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("members")}
                className={cn(
                  "rounded-md px-3 py-1 font-bold text-xs transition-all",
                  activeTab === "members"
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white",
                )}
              >
                Members ({activeMembers.length})
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-6 w-6 rounded-full text-white/50 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="relative flex-1 overflow-hidden">
            {activeTab === "chat" ? (
              <div className="flex h-full flex-col">
                <div
                  ref={chatContainerRef}
                  className="scrollbar-hide flex-1 space-y-3 overflow-y-auto p-4"
                >
                  {/* Messages Placeholder */}
                  {messages.length === 0 && (
                    <div className="mt-10 text-center text-white/30 text-xs">
                      No messages yet. Say hello! 👋
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isOwnMessage = msg.user === currentUserNickname;

                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "mb-3 flex flex-col",
                          isOwnMessage ? "items-end" : "items-start",
                        )}
                      >
                        {/* Username - only show for others */}
                        {!isOwnMessage && (
                          <span className="mb-1 px-2 text-[10px] text-white/50">
                            {msg.user}
                          </span>
                        )}

                        {/* Message bubble */}
                        <div
                          className={cn(
                            "max-w-[80%] break-words rounded-2xl px-3 py-2 text-sm",
                            isOwnMessage
                              ? "rounded-br-sm bg-blue-600 text-white"
                              : "rounded-bl-sm bg-white/10 text-white",
                          )}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form
                  onSubmit={handleSendMessage}
                  className="flex gap-2 border-white/10 border-t p-3"
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="h-9 rounded-xl border-white/10 bg-white/5 text-white text-xs focus:ring-0"
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </form>
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-2">
                {activeMembers.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5"
                  >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800 text-white text-xs">
                      {member.profile?.avatar_url ? (
                        <Image
                          src={member.profile.avatar_url}
                          alt=""
                          fill
                          sizes="32px"
                          className="rounded-full object-cover"
                        />
                      ) : (
                        member.profile?.nickname?.[0] || "U"
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white">
                        {member.profile?.nickname || "Unknown"}
                      </span>
                      <span className="text-white/40 text-xs capitalize">
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-4">
                  <Button
                    className="w-full border border-white/10 bg-white/10 text-white hover:bg-white/20"
                    variant="outline"
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share Room Link
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
