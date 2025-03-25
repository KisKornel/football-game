/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { State, Actions } from "@/types/types";
import { Colors } from "@/enums/enums";

const useGameStore = create<State & Actions>()(
  devtools((set) => ({
    rooms: {},
    localPlayer: null,
    players: {},
    ball: {
      id: "ball-1",
      color: Colors.RED,
      position: { x: 0, y: 10, z: 0 },
      lastUpdate: Date.now(),
      lastTouchedBy: "",
    },
    scoreBoard: null,
    setScoreBoard: (newScore) =>
      set(() => ({
        scoreBoard: newScore,
      })),
    updateScoreBoard: (newScore) =>
      set((state) => {
        if (!state.scoreBoard) {
          console.warn("Score board is null, cannot update.");
          return state;
        }
        return {
          scoreBoard: { ...state.scoreBoard, ...newScore },
        };
      }),
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
    updateBall: (updateBall) =>
      set((state) => ({
        ball: { ...state.ball, ...updateBall },
      })),
  }))
);

export default useGameStore;
