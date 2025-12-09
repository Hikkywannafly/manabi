import { create } from "zustand";
import type { RoomUser } from "@/services/room-service";

interface PresenceState {
  onlineUsers: RoomUser[];
  isConnected: boolean;
  setOnlineUsers: (users: RoomUser[]) => void;
  setIsConnected: (isConnected: boolean) => void;
  addUser: (user: RoomUser) => void;
  removeUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: RoomUser["status"]) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUsers: [],
  isConnected: false,
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setIsConnected: (isConnected) => set({ isConnected }),
  addUser: (user) =>
    set((state) => ({ onlineUsers: [...state.onlineUsers, user] })),
  removeUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((u) => u.user_id !== userId),
    })),
  updateUserStatus: (userId, status) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.map((u) =>
        u.user_id === userId ? { ...u, status } : u,
      ),
    })),
}));
