import React from "react";
import { TeamType } from "@/types/types";

interface ChooseTeamProps {
  isMaxSize: boolean;
  team: TeamType;
  title: string;
  updatePlayerTeam: (team: TeamType) => Promise<void>;
}

export const ChooseTeam = ({
  isMaxSize,
  team,
  title,
  updatePlayerTeam,
}: ChooseTeamProps) => {
  return (
    <button
      type="submit"
      className={`w-56 h-10 rounded-2xl shadow-lg ${
        !isMaxSize
          ? "shadow-lg hover:bg-amber-500 shadow-amber-400 bg-amber-400 text-slate-800"
          : "bg-slate-700 text-slate-400"
      } cursor-pointer`}
      onClick={() => {
        updatePlayerTeam(team);
      }}
      disabled={isMaxSize}
    >
      {title}
    </button>
  );
};
