import { create } from "zustand";
import { ScoreBoardType } from "@/types/types";
import { generateRandomId } from "@/utils/functions/functions";

interface State {
  scoreBoard: ScoreBoardType;
}

interface Actions {
  incraseHome: () => void;
  incraseAway: () => void;
  resetScoreBoard: () => void;
}

const initScoreBoard = {
  id: generateRandomId(),
  home: 0,
  away: 0,
};

const useScoreStore = create<State & Actions>()((set) => ({
  scoreBoard: initScoreBoard,
  incraseHome: () =>
    set((state) => ({
      scoreBoard: { ...state.scoreBoard, home: state.scoreBoard.home + 1 },
    })),
  incraseAway: () =>
    set((state) => ({
      scoreBoard: { ...state.scoreBoard, away: state.scoreBoard.away + 1 },
    })),
  resetScoreBoard: () => set({ scoreBoard: initScoreBoard }),
}));

export default useScoreStore;
