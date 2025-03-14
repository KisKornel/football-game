"use client";

import AddRoom from "@/components/AddRoom";
import Loading from "@/components/Loading";
import useGameStore from "@/store/gameStore";
import { supabase } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const router = useRouter();

  const rooms = useGameStore((state) => state.rooms);
  const addRoom = useGameStore((state) => state.addRoom);

  const [isLoading, setIsLoading] = useState(true);

  const getRooms = async () => {
    try {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at");

      if (data) {
        data.forEach((room) => addRoom(room.id, room));
      }
    } catch (error) {
      console.error("Hiba a szobák lekérésében:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-start items-center w-full h-screen py-2 gap-y-8">
      <h1 className="text-3xl">Üdvözöllek!</h1>
      <AddRoom />
      <h2 className="text-2xl">Aktív szobák</h2>
      <div className="w-full grid grid-cols-4 gap-4 px-4">
        {Object.keys(rooms).length > 0 ? (
          Object.entries(rooms).map(([id, room]) => (
            <div
              key={id}
              className="w-full flex flex-col justify-center items-center gap-y-2 bg-slate-900 pt-2 rounded-2xl"
            >
              <h2 className="text-2xl">{room.name}</h2>

              <button
                type="button"
                className={`w-full h-10 flex flex-row justify-center items-center gap-x-2 rounded-2xl ${
                  room.is_available
                    ? "shadow-lg hover:bg-amber-500 shadow-amber-400 bg-amber-400 text-slate-800"
                    : "bg-slate-700 text-slate-400"
                }  cursor-pointer `}
                onClick={() => router.push(`/rooms/${room.id}`)}
                disabled={!room.is_available}
              >
                {room.is_available ? (
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
