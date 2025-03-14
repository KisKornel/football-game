"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/server";
import useGameStore from "@/store/gameStore";
import { Spinner } from "@/components/svg/spinner";

const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const Room = ({ params }: { params: Promise<{ roomId: string }> }) => {
  const { roomId } = use(params);
  const router = useRouter();

  const setLocalPlayer = useGameStore((state) => state.setLocalPlayer);

  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterPlayer = async () => {
    try {
      if (!username || !roomId) return;

      setIsLoading(true);

      const position = {
        x: getRandomNumber(-15, 15),
        y: 2,
        z: getRandomNumber(-15, 15),
      };

      const { data } = await supabase
        .from("players")
        .insert([
          {
            username: username,
            position,
            rotation: 0,
            color: generateRandomHexColor(),
            room_id: roomId,
            online: true,
          },
        ])
        .select()
        .single();

      if (data) {
        setUsername("");
        setLocalPlayer(data);

        router.push(`/rooms/${roomId}/user/${data.id}`);
      }
    } catch (error) {
      console.error("Hiba a játékos regisztrációja közben: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row justify-center items-start w-full h-screen">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col justify-start items-center gap-y-4">
          <div className="w-full py-2 flex flex-row justify-center items-center rounded-3xl bg-slate-800">
            <h1>Játékos regisztrálása</h1>
          </div>

          <label
            className="block text-slate-50 text-sm font-bold"
            htmlFor="username"
          >
            Adj meg egy karakternevet
          </label>
          <input
            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-slate-50 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Random Sanyi"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="button"
            className={`w-full h-10 flex flex-row justify-center items-center gap-x-2 rounded-2xl ${
              username
                ? "shadow-lg hover:bg-amber-500 shadow-amber-400 bg-amber-400 text-slate-800"
                : "bg-slate-700 text-slate-400"
            }  cursor-pointer `}
            onClick={handleRegisterPlayer}
            disabled={!username}
          >
            {!isLoading ? <span>Tovább</span> : <Spinner size="small" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
