import { create } from "zustand";
import { Colors } from "@/enums/enums";
import { BallType } from "@/types/types";
import { generateRandomId } from "@/utils/functions/functions";

interface State {
  ball: BallType;
}

interface Actions {
  updateBall: (ball: Omit<BallType, "id">) => void;
  resetBall: () => void;
}

const initBall = {
  id: generateRandomId(),
  color: Colors.RED,
  position: { x: 0, y: 10, z: 0 },
  updatedAt: new Date().toISOString(),
  lastTouchedBy: "",
};

const useBallStore = create<State & Actions>()((set) => ({
  ball: initBall,
  updateBall: (ball) => set((state) => ({ ball: { ...state.ball, ball } })),
  resetBall: () => set({ ball: initBall }),
}));

export default useBallStore;
