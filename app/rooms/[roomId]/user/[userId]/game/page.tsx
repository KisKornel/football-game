/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { use, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/server";
import Loading from "@/components/Loading";
import useGameStore from "@/store/gameStore";
import { useChannelContext } from "@/contexts/ChannelContext";
import { DeleteIcon } from "@/components/svg/deleteIcon";

const GameContent = dynamic(() => import("@/components/GameContent"), {
  ssr: false,
});

const GamePage = ({
  params,
}: {
  params: Promise<{ roomId: string; userId: string }>;
}) => {
  const { roomId, userId } = use(params);
  console.log(userId, roomId);

  const router = useRouter();

  const { isConnected, onDeletePlayer } = useChannelContext();

  const setLocalPlayer = useGameStore((state) => state.setLocalPlayer);
  const localPlayer = useGameStore((state) => state.localPlayer);
  const deletePlayer = useGameStore((state) => state.deletePlayer);

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

  const handleDeletePlayer = async () => {
    if (!roomId || !userId) return;

    const { error } = await supabase.from("players").delete().eq("id", userId);

    if (error) {
      console.error("Error delete player: ", error);
      return;
    }

    onDeletePlayer(userId);
    deletePlayer(userId);
    setLocalPlayer(null);

    router.replace("/");
  };

  if (!isConnected || !localPlayer) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="py-2 w-full flex flex-row justify-center items-center z-100 bg-slate-800">
        <p>0 - 0</p>
        <button
          type="button"
          className="absolute right-1 top-0 flex flex-row justify-center items-center p-2 cursor-pointer"
          onClick={() => handleDeletePlayer()}
          disabled={!localPlayer || !userId}
        >
          <DeleteIcon />
        </button>
      </div>

      <div className="size-full">
        <GameContent />
      </div>
    </div>
  );
};

export default GamePage;
