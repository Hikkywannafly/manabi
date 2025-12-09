import { create } from "zustand";
import {
  type RoomUser,
  roomService,
  type StudyRoom,
} from "@/services/room-service";

interface RoomState {
  currentRoom: StudyRoom | null;
  roomUsers: RoomUser[];
  isLoading: boolean;
  error: string | null;

  createRoom: (name: string, settings?: Partial<StudyRoom>) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  setRoomUsers: (users: RoomUser[]) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  currentRoom: null,
  roomUsers: [],
  isLoading: false,
  error: null,

  createRoom: async (name, settings) => {
    set({ isLoading: true, error: null });
    try {
      const room = await roomService.createRoom(name, settings);
      // Automatically join created room
      await roomService.joinRoom(room.id);
      set({ currentRoom: room, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  joinRoom: async (roomId) => {
    set({ isLoading: true, error: null });
    try {
      await roomService.joinRoom(roomId);
      // We need to fetch room details too if we just have ID
      // For now, assuming we might need to fetch it separately or pass it in.
      // But let's just set loading false for now.
      // Ideally we fetch the room object.
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  leaveRoom: async () => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    set({ isLoading: true, error: null });
    try {
      await roomService.leaveRoom(currentRoom.id);
      set({ currentRoom: null, roomUsers: [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setRoomUsers: (users) => set({ roomUsers: users }),
}));
