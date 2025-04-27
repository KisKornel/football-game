import { create } from "zustand";
import { BallType, ScoreBoardType } from "@/types/types";
import { generateRandomId } from "@/utils/functions/functions";

interface State {
  scoreBoard: ScoreBoardType;
  ball: BallType;
}

interface Actions {
  increaseHome: () => void;
  increaseAway: () => void;
  resetScoreBoard: () => void;
  setBall: (ball: BallType) => void;
}

const initScoreBoard: ScoreBoardType = {
  id: generateRandomId(),
  home: 0,
  away: 0,
};

const initBall: BallType = {
  position: {
    x: 0,
    y: 5,
    z: 0,
  },
  velocity: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0, w: 1 },
};

const useGameStore = create<State & Actions>()((set) => ({
  ball: initBall,
  scoreBoard: initScoreBoard,
  increaseHome: () =>
    set((state) => ({
      scoreBoard: { ...state.scoreBoard, home: state.scoreBoard.home + 1 },
    })),
  increaseAway: () =>
    set((state) => ({
      scoreBoard: { ...state.scoreBoard, away: state.scoreBoard.away + 1 },
    })),
  setBall: (ball) => set({ ball }),
  resetScoreBoard: () => set({ scoreBoard: initScoreBoard }),
}));

export default useGameStore;
