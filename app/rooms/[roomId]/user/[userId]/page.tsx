/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import useGameStore from "@/store/gameStore";
import { useChannelContext } from "@/contexts/ChannelContext";
import { TeamType } from "@/types/types";
import { Teams } from "@/components/Teams";
import { Spinner } from "@/components/svg/spinner";
import { ChooseTeam } from "@/components/ChooseTeam";

const MAX_SIZE_TEAM = 1;
const COUNTER = 5;

const UserPage = ({
  params,
}: {
  params: Promise<{ roomId: string; userId: string }>;
}) => {
  const { roomId, userId } = use(params);
  const router = useRouter();

  const { isConnected, isStartGame } = useChannelContext();

  const setLocalPlayer = useGameStore((state) => state.setLocalPlayer);
  const localPlayer = useGameStore((state) => state.localPlayer);
  const players = useGameStore((state) => state.players);
  const updateLocalPlayer = useGameStore((state) => state.updateLocalPlayer);

  const [counter, setCounter] = useState<number>(COUNTER);

  const isTeamMaxSize = (team: TeamType) => {
    const size = Object.entries(players).filter(
      ([_, player]) => player.team === team
    ).length;

    return size === MAX_SIZE_TEAM;
  };

  useEffect(() => {
    if (!localPlayer) {
      const getLocalPlayer = async () => {
        console.log("Get local player");

        const { data, error } = await supabase
          .from("players")
          .select("*")
          .eq("room_id", roomId)
          .eq("id", userId);

        if (error) {
          console.error("Error get local player: ", error);
          return;
        }

        if (data) {
          setLocalPlayer(data[0]);
        }
      };

      getLocalPlayer();
    }
  }, [userId]);

  useEffect(() => {
    if (isStartGame) {
      startCountdown(COUNTER - 1);
    }
  }, [isStartGame]);

  const startCountdown = (seconds: number) => {
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
  };

  const updatePlayerTeam = async (team: TeamType) => {
    const { error } = await supabase
      .from("players")
      .update({ team })
      .eq("id", userId);

    if (error) {
      console.error(`Player team update error with ${userId} id`, error);
    }

    updateLocalPlayer({ team });
  };

  const updateReady = async () => {
    if (!localPlayer) return;

    const { error } = await supabase
      .from("players")
      .update({ ready: true })
      .eq("id", userId);

    if (error) {
      console.log("Error: ", error);
    }

    updateLocalPlayer({ ready: true });
  };

  if (!isConnected || !localPlayer) {
    return <Loading />;
  }

  return (
    <div className="flex flex-row justify-center items-start w-full h-screen">
      <div className="flex flex-col gap-y-2 size-full max-w-5xl p-4">
        <div className="w-full h-2/3 grid grid-cols-3 gap-x-2">
          <Teams
            title="Hazai csapat"
            team="home"
            updatePlayerTeam={updatePlayerTeam}
          />
          <Teams title="Elérhető játékosok" team="no" />
          <Teams
            title="Vendég csapat"
            team="away"
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
              {Object.entries(players)
                .filter(([id, player]) => player.room_id === roomId)
                .some(([id, player]) => player.team === "no") ||
              Object.keys(players).length !== MAX_SIZE_TEAM * 2 ? (
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
