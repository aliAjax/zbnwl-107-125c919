import { create } from 'zustand';
import type { Room } from '@/types';
import { mockRooms } from '@/data/mockRooms';
import { getFromLocalStorage, setToLocalStorage } from '@/hooks/useLocalStorage';

interface RoomState {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  getRoomById: (id: string) => Room | undefined;
}

const STORAGE_KEY = 'script-killer-rooms';

const initialRooms = getFromLocalStorage<Room[]>(STORAGE_KEY, mockRooms);

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: initialRooms,

  addRoom: (room) => {
    const newRoom: Room = {
      ...room,
      id: `room-${Date.now()}`
    };
    set((state) => {
      const rooms = [...state.rooms, newRoom];
      setToLocalStorage(STORAGE_KEY, rooms);
      return { rooms };
    });
  },

  updateRoom: (id, room) => {
    set((state) => {
      const rooms = state.rooms.map((r) =>
        r.id === id ? { ...r, ...room } : r
      );
      setToLocalStorage(STORAGE_KEY, rooms);
      return { rooms };
    });
  },

  deleteRoom: (id) => {
    set((state) => {
      const rooms = state.rooms.filter((r) => r.id !== id);
      setToLocalStorage(STORAGE_KEY, rooms);
      return { rooms };
    });
  },

  getRoomById: (id) => {
    return get().rooms.find((r) => r.id === id);
  }
}));
