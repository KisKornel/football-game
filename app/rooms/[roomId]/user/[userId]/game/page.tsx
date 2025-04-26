"use client";

import React, { use } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/server";
import { DeleteIcon } from "@/components/svg/deleteIcon";
import useGameStore from "@/store/gameStore";
import { useChannelContext } from "@/contexts/ChannelContext";
import { useGameChannelContext } from "@/contexts/GameChannelContext";

const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
});

const GamePage = ({
  params,
}: {
  params: Promise<{ roomId: string; userId: string }>;
}) => {
  const { roomId, userId } = use(params);

  const router = useRouter();

  const { channel } = useChannelContext();
  const { isConnected, transport } = useGameChannelContext();

  const scoreBoard = useGameStore((state) => state.scoreBoard);
  const resetScoreBoard = useGameStore((state) => state.resetScoreBoard);

  const handleDeletePlayer = async () => {
    if (!roomId || !userId) return;

    try {
      const { error } = await supabase
        .from("characters")
        .delete()
        .eq("id", userId);

      if (error) {
        throw new Error(`Player delete error with ${userId} id`);
      }

      channel?.send({
        type: "broadcast",
        event: "delete-character",
        payload: { id: userId },
      });

      resetScoreBoard();

      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="absolute top-10 left-2 flex flex-col justify-center items-start z-50">
        <p className="text-xs">
          Status: {isConnected ? "connected" : "disconnected"}
        </p>
        <p className="text-xs">Transport: {transport}</p>
      </div>
      <div className="py-2 w-full flex flex-row justify-center items-center z-100 bg-slate-800">
        <p>
          Hazai {scoreBoard.home} - {scoreBoard.away} Vendég
        </p>
        <button
          type="button"
          className="absolute right-1 top-0 flex flex-row justify-center items-center p-2 cursor-pointer"
          onClick={handleDeletePlayer}
          disabled={!userId}
        >
          <DeleteIcon />
        </button>
      </div>

      <div className="size-full">
        <Game />
      </div>
    </div>
  );
};

export default GamePage;
