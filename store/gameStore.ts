import { create } from "zustand";
import { PositionType, ScoreBoardType } from "@/types/types";
import { generateRandomId } from "@/utils/functions/functions";

interface State {
  scoreBoard: ScoreBoardType;
  ballPosition: PositionType;
}

interface Actions {
  increaseHome: () => void;
  increaseAway: () => void;
  resetScoreBoard: () => void;
  resetBallPosition: () => void;
}

const initScoreBoard: ScoreBoardType = {
  id: generateRandomId(),
  home: 0,
  away: 0,
};

const initBallPosition: PositionType = { x: 0, y: 5, z: 0 };

const useGameStore = create<State & Actions>()((set) => ({
  scoreBoard: initScoreBoard,
  ballPosition: initBallPosition,
  increaseHome: () =>
    set((state) => ({
      scoreBoard: { ...state.scoreBoard, home: state.scoreBoard.home + 1 },
    })),
  increaseAway: () =>
    set((state) => ({
      scoreBoard: { ...state.scoreBoard, away: state.scoreBoard.away + 1 },
    })),
  resetScoreBoard: () => set({ scoreBoard: initScoreBoard }),
  resetBallPosition: () => set({ ballPosition: initBallPosition }),
}));

export default useGameStore;
