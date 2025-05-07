"use client";

import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";
import useCharactersStore from "@/store/charactersStore";
import { CharacterType, TeamType } from "@/types/types";
import { Teams } from "@/components/Teams";
import { Spinner } from "@/components/svg/spinner";
import { ChooseTeam } from "@/components/ChooseTeam";
import Loading from "@/components/Loading";
import { useChannelContext } from "@/contexts/ChannelContext";
import { gameConfig } from "@/config/gameConfig";

const COUNTER = 2;

const UserPage = ({
  params,
}: {
  params: Promise<{ roomId: string; userId: string }>;
}) => {
  const { roomId, userId } = use(params);
  const router = useRouter();

  const { isStartGame } = useChannelContext();

  const characters = useCharactersStore((state) => state.characters);

  const [counter, setCounter] = useState<number>(COUNTER);
  const [homeTeam, setHomeTeam] = useState<CharacterType[]>([]);
  const [noTeam, setNoTeam] = useState<CharacterType[]>([]);
  const [awayTeam, setAwayTeam] = useState<CharacterType[]>([]);

  const localPlayer = useMemo(() => {
    if (!userId) return;

    const localPlayer = characters.filter((c) => c.id === userId)[0];
    return localPlayer;
  }, [characters, userId]);

  useEffect(() => {
    if (!characters.length) return;

    const initTeams = () => {
      const noTeams: CharacterType[] = [];
      const homeTeams: CharacterType[] = [];
      const awayTeams: CharacterType[] = [];

      characters.map((c) => {
        if (c.team === "no") {
          noTeams.push(c);
        }
        if (c.team === "home") {
          homeTeams.push(c);
        }

        if (c.team === "away") {
          awayTeams.push(c);
        }
      });

      setNoTeam(noTeams);
      setHomeTeam(homeTeams);
      setAwayTeam(awayTeams);
    };

    initTeams();
  }, [characters]);

  const isTeamMaxSize = (team: TeamType) => {
    const size = characters.filter((c) => c.team === team).length;

    return size === gameConfig.maxTeamSize;
  };

  const startCountdown = useCallback(
    (seconds: number) => {
      let count = seconds;

      const interval = setInterval(() => {
        setCounter(count);
        count--;

        if (count < 0) {
          clearInterval(interval);
          console.log("Strating game...");
          router.push(`/rooms/${roomId}/user/${userId}/game`);
        }
      }, 1000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (isStartGame) {
      startCountdown(COUNTER - 1);
    }
  }, [isStartGame, startCountdown]);

  const updateReady = async () => {
    try {
      const { error } = await supabase
        .from("characters")
        .update({ ready: true })
        .eq("id", userId);

      if (error) {
        throw new Error(`Player ready update error with ${userId} id`, error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePlayerTeam = async (team: TeamType) => {
    try {
      const { error } = await supabase
        .from("characters")
        .update({ team })
        .eq("id", userId);

      if (error) {
        throw new Error(`Player team update error with ${userId} id`, error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!localPlayer) {
    return <Loading />;
  }

  return (
    <div className="flex flex-row justify-center items-start w-full h-screen">
      <div className="flex flex-col gap-y-2 size-full max-w-5xl p-4">
        <div className="w-full h-2/3 grid grid-cols-3 gap-x-2">
          <Teams
            title="Hazai csapat"
            team="home"
            userId={userId}
            characters={homeTeam}
            updatePlayerTeam={updatePlayerTeam}
          />
          <Teams
            title="Elérhető játékosok"
            team="no"
            userId={userId}
            characters={noTeam}
          />
          <Teams
            title="Vendég csapat"
            team="away"
            userId={userId}
            characters={awayTeam}
            updatePlayerTeam={updatePlayerTeam}
          />
        </div>
        <div className="w-full h-1/3 flex flex-row justify-center items-start">
          {localPlayer.team === "no" ? (
            <div className="w-full flex flex-row justify-around items-start">
              <ChooseTeam
                isMaxSize={isTeamMaxSize("home")}
                team="home"
                title="Hazai csapat"
                updatePlayerTeam={updatePlayerTeam}
              />
              <h1 className="text-2xl">Válassz csapatot</h1>
              <ChooseTeam
                isMaxSize={isTeamMaxSize("away")}
                team="away"
                title="Vendég csapat"
                updatePlayerTeam={updatePlayerTeam}
              />
            </div>
          ) : (
            <div className="w-full flex flex-row justify-center items-start">
              {characters
                .filter((c) => c.roomId === roomId)
                .some((c) => c.team === "no") ||
              characters.length !== gameConfig.maxTeamSize * 2 ? (
                <div>Várakozás a többi játékosra...</div>
              ) : (
                <div>
                  <button
                    type="submit"
                    className={`w-56 h-10 flex flex-row justify-center items-center gap-x-2 rounded-2xl shadow-lg ${
                      !localPlayer.ready
                        ? "shadow-lg hover:bg-amber-500 shadow-amber-400 bg-amber-400 text-slate-800"
                        : "bg-slate-700 text-slate-400"
                    } cursor-pointer`}
                    onClick={updateReady}
                    disabled={localPlayer.ready}
                  >
                    {!localPlayer.ready ? (
                      <span>Játék indítása</span>
                    ) : !isStartGame ? (
                      <>
                        <Spinner size="small" />
                        <span>Várakozás...</span>
                      </>
                    ) : (
                      <span>{`Indul... (${counter})`}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
