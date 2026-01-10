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
  isInitializing: boolean;
  error: string | null;

  createRoom: (name: string, settings?: Partial<StudyRoom>) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  initializePersonalRoom: () => Promise<void>;
  restoreCurrentRoom: () => Promise<void>;
  updateRoomProfile: (settings: Partial<StudyRoom>) => Promise<void>;
  setRoomUsers: (users: RoomUser[]) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  currentRoom: null,
  roomUsers: [],
  isLoading: false,
  isInitializing: false,
  error: null,

  createRoom: async (name, settings) => {
    set({ isLoading: true, error: null });
    try {
      const room = await roomService.createRoom(name, settings);
      // Automatically join created room
      await roomService.joinRoom(room.id);
      // Fetch full room details (with owner/users)
      const fullRoom = await roomService.getRoom(room.id);
      set({ currentRoom: fullRoom, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  joinRoom: async (roomId) => {
    set({ isLoading: true, error: null });
    try {
      await roomService.joinRoom(roomId);
      // Fetch room details after joining
      const room = await roomService.getRoom(roomId);
      set({ currentRoom: room, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
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

  initializePersonalRoom: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Get/Create personal room
      // We pass a default name, but service checks if one exists for user first
      const room = await roomService.createRoom("My Room");

      // 2. Join it
      await roomService.joinRoom(room.id);

      // 3. Set state
      const fullRoom = await roomService.getRoom(room.id);
      set({ currentRoom: fullRoom, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  restoreCurrentRoom: async () => {
    const { isInitializing, currentRoom } = get();
    // Guard: prevent concurrent calls or if already has a room
    if (isInitializing || currentRoom) return;

    set({ isInitializing: true, isLoading: true, error: null });
    try {
      // Check if user is currently in any room
      const currentRoomData = await roomService.getCurrentUserRoom();

      if (currentRoomData) {
        // User is in a room, restore it
        const fullRoom = await roomService.getRoom(currentRoomData.room_id);
        set({ currentRoom: fullRoom, isLoading: false, isInitializing: false });
      } else {
        // User not in any room, initialize personal room
        await get().initializePersonalRoom();
        set({ isInitializing: false });
      }
    } catch (_error: any) {
      // Fallback to personal room
      await get().initializePersonalRoom();
      set({ isInitializing: false });
    }
  },

  updateRoomProfile: async (settings: Partial<StudyRoom>) => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    set({ isLoading: true, error: null });
    try {
      const updated = await roomService.updateRoomSettings(
        currentRoom.id,
        settings,
      );
      // Merge update with current room state
      set({
        currentRoom: { ...currentRoom, ...updated },
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setRoomUsers: (users) => set({ roomUsers: users }),
}));
