/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Colors } from "@/enums/keyControls";
import { State, Actions } from "@/types/types";

const useGameStore = create<State & Actions>()(
  devtools((set) => ({
    rooms: {},
    localPlayer: null,
    players: {},
    ball: {
      id: "ball-1",
      color: Colors.RED,
      velocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 3, z: 0 },
      controlledBy: "",
    },
    setLocalPlayer: (newPlayer) =>
      set(() => ({
        localPlayer: newPlayer,
      })),
    updateRoom: (id, updateData) =>
      set((state) => {
        if (!state.rooms[id]) {
          console.warn(`Rooms with id ${id} does not exist.`);
          return state;
        }
        return {
          rooms: {
            ...state.rooms,
            [id]: {
              ...state.rooms[id],
              ...updateData,
            },
          },
        };
      }),
    updateLocalPlayer: (updateData) =>
      set((state) => {
        if (!state.localPlayer) {
          console.warn("Local player is null, cannot update.");
          return state;
        }
        return {
          localPlayer: {
            ...state.localPlayer,
            ...updateData,
          },
        };
      }),
    addRoom: (id, newRoom) =>
      set((state) => ({
        rooms: {
          ...state.rooms,
          [id]: newRoom,
        },
      })),
    addPlayer: (id, newPlayer) =>
      set((state) => ({
        players: {
          ...state.players,
          [id]: newPlayer,
        },
      })),
    updatePlayer: (id, updatedPlayer) =>
      set((state) => {
        if (!state.players[id]) {
          console.warn(`Player with id ${id} does not exist.`);
          return state;
        }
        return {
          players: {
            ...state.players,
            [id]: {
              ...state.players[id],
              ...updatedPlayer,
            },
          },
        };
      }),
    deletePlayer: (id) =>
      set((state) => {
        const { [id]: _, ...remainingPlayers } = state.players;
        return {
          players: remainingPlayers,
        };
      }),
    updateBall: (newState) =>
      set((state) => ({
        ball: { ...state.ball, ...newState },
      })),
  }))
);

export default useGameStore;
