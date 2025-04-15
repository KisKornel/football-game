"use client";

import AddRoom from "@/components/AddRoom";
import Loading from "@/components/Loading";
import useRoomStore from "@/store/roomStore";
import { supabase } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const router = useRouter();

  const rooms = useRoomStore((state) => state.rooms);
  const setRooms = useRoomStore((state) => state.setRooms);

  const [isLoading, setIsLoading] = useState(true);

  const getRooms = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .order("createdAt");

      if (data) {
        setRooms(data);
      }
    } catch (error) {
      console.error("Hiba a szobák lekérésében:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setRooms]);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative flex flex-col justify-start items-center w-full h-screen py-2 gap-y-8">
      <h1 className="text-3xl">Üdvözöllek!</h1>
      <AddRoom />
      <h2 className="text-2xl">Aktív szobák</h2>
      <div className="w-full grid grid-cols-4 gap-4 px-4">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.id}
              className="w-full flex flex-col justify-center items-center gap-y-2 bg-slate-900 pt-2 rounded-2xl"
            >
              <h2 className="text-2xl">{room.name}</h2>

              <button
                type="button"
                className={`w-full h-10 flex flex-row justify-center items-center gap-x-2 rounded-2xl ${
                  room.available
                    ? "shadow-lg hover:bg-amber-500 shadow-amber-400 bg-amber-400 text-slate-800"
                    : "bg-slate-700 text-slate-400"
                }  cursor-pointer `}
                onClick={() => router.push(`/rooms/${room.id}`)}
                disabled={!room.available}
              >
                {room.available ? (
                  <span>Csatlakozás</span>
                ) : (
                  <span>A szoba megtelt</span>
                )}
              </button>
            </div>
          ))
        ) : (
          <p>Nincsenek elérhető szobák!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
