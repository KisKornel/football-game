"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/server";
import useCharactersStore from "@/store/charactersStore";
import { Spinner } from "@/components/svg/spinner";

const Room = ({ params }: { params: Promise<{ roomId: string }> }) => {
  const { roomId } = use(params);
  const router = useRouter();

  const characters = useCharactersStore((state) => state.characters);

  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const generateRandomHexColor = () => {
    const n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
  };

  const handleRegisterPlayer = async () => {
    if (!username || !roomId) return;
    setIsLoading(true);

    const isFirstPlayer = characters.length === 0;

    const position = {
      x: getRandomNumber(-5, 5),
      y: 0,
      z: getRandomNumber(-5, 5),
    };

    const hairColor = generateRandomHexColor();
    const pantsColor = generateRandomHexColor();
    const shirtColor = generateRandomHexColor();

    try {
      const { data: character, error } = await supabase
        .from("characters")
        .insert([
          {
            username,
            position,
            hairColor,
            pantsColor,
            shirtColor,
            roomId: roomId,
            host: isFirstPlayer ?? false,
            online: false,
            ready: false,
            team: "no",
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error("Hiba a játékos regisztrációja közben: ", error);
      }

      if (character) {
        setUsername("");

        router.push(`/rooms/${roomId}/user/${character.id}`);
      }
    } catch (error) {
      console.log(error);
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
            disabled={!username || isLoading}
          >
            {!isLoading ? <span>Tovább</span> : <Spinner size="small" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
