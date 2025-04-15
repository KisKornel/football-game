import { create } from "zustand";
import { RoomType } from "@/types/types";

interface State {
  rooms: RoomType[];
}

interface Actions {
  setRooms: (rooms: RoomType[]) => void;
  addRoom: (room: RoomType) => void;
  updateRoom: (room: RoomType) => void;
}

const useRoomStore = create<State & Actions>()((set) => ({
  rooms: [],
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) =>
    set((state) => ({
      rooms: [...state.rooms, room],
    })),
  updateRoom: (room) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === room.id ? room : r)),
    })),
}));

export default useRoomStore;
