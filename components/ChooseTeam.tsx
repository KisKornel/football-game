import React from "react";
import { TeamType } from "@/types/types";

interface ChooseTeamProps {
  updatePlayerTeam: (team: TeamType) => void;
  isMaxSize: boolean;
  team: TeamType;
  title: string;
}

export const ChooseTeam = ({
  updatePlayerTeam,
  isMaxSize,
  team,
  title,
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
