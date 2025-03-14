/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { PlayerType, TeamType } from "@/types/types";
import { DeleteIcon } from "./svg/deleteIcon";
import useGameStore from "@/store/gameStore";
import Loading from "./Loading";

interface TeamsPorps {
  title: string;
  updatePlayerTeam?: (team: TeamType) => void;
  team: TeamType;
}

export const Teams = ({ title, team, updatePlayerTeam }: TeamsPorps) => {
  const localPlayer = useGameStore((state) => state.localPlayer);
  const players = useGameStore((state) => state.players);

  const filteredPlayers = Object.entries(players).filter(
    ([_, player]) => player.team === team
  );

  if (!localPlayer) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-start items-center gap-y-2 border-2 rounded-3xl border-slate-800 p-2 size-full overflow-auto">
      <div className="flex flex-row justify-center items-center w-full py-2 border-b border-slate-800">
        {title}
      </div>
      <div className="flex flex-col w-full gap-y-2 overflow-y-auto">
        {filteredPlayers.length > 0 &&
          filteredPlayers.map(([id, player]) => (
            <div
              key={id}
              className={`relative flex flex-row justify-center items-center w-full py-2 rounded-4xl  ${
                team === "home"
                  ? "bg-green-500"
                  : team === "away"
                  ? "bg-cyan-500"
                  : "bg-slate-800"
              } `}
            >
              <p>{player.username}</p>

              {team !== "no" &&
                localPlayer?.id === id &&
                !localPlayer.ready &&
                updatePlayerTeam && (
                  <button
                    type="submit"
                    className="absolute right-2 p-1 rounded-full hover:bg-slate-700 cursor-pointer"
                    onClick={() => {
                      updatePlayerTeam("no");
                    }}
                  >
                    <DeleteIcon />
                  </button>
                )}
            </div>
          ))}
      </div>
    </div>
  );
};
