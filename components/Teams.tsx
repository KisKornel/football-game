import React from "react";
import { CharacterType, TeamType } from "@/types/types";
import { DeleteIcon } from "./svg/deleteIcon";

interface TeamsPorps {
  title: string;
  userId: string;
  team: TeamType;
  characters: CharacterType[];
  updatePlayerTeam?: (team: TeamType) => Promise<void>;
}

export const Teams = ({
  title,
  team,
  userId,
  characters,
  updatePlayerTeam,
}: TeamsPorps) => {
  return (
    <div className="flex flex-col justify-start items-center gap-y-2 border-2 rounded-3xl border-slate-800 p-2 size-full overflow-auto">
      <div className="flex flex-row justify-center items-center w-full py-2 border-b border-slate-800">
        {title}
      </div>
      <div className="flex flex-col w-full gap-y-2 overflow-y-auto">
        {characters.map((c) => (
          <div
            key={c.id}
            className={`relative flex flex-row justify-center items-center w-full py-2 rounded-4xl ${
              team === "home"
                ? "bg-green-500"
                : team === "away"
                ? "bg-cyan-500"
                : "bg-slate-800"
            } `}
          >
            <p>{c.username}</p>
            {updatePlayerTeam &&
              team !== "no" &&
              c.id === userId &&
              !c.ready && (
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
