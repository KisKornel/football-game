import React, { useState } from "react";
import { supabase } from "@/utils/supabase/server";
import useRoomStore from "@/store/roomStore";

const AddRoom = () => {
  const addRoom = useRoomStore((state) => state.addRoom);
  const [roomName, setRoomName] = useState("");

  const createRoom = async (roomName: string) => {
    try {
      const { data } = await supabase
        .from("rooms")
        .insert([{ name: roomName }])
        .select()
        .single();

      if (!data) {
        throw new Error("Hiba a szoba létrehozása közbet!");
      }

      if (data) {
        addRoom(data);
      }
    } catch (error) {
      console.error("Hiba a szoba létrehozásakor:", error);
    }
  };

  const handleCreateRoom = () => {
    if (roomName.trim() !== "") {
      createRoom(roomName);
      setRoomName("");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Szoba neve"
        className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-slate-50 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        onClick={handleCreateRoom}
        className={`w-full h-10 flex flex-row justify-center items-center gap-x-2 rounded-2xl ${
          roomName
            ? "shadow-lg hover:bg-amber-500 shadow-amber-400 bg-amber-400 text-slate-800"
            : "bg-slate-700 text-slate-400"
        }  cursor-pointer `}
        disabled={!roomName}
      >
        Új szoba létrehozása
      </button>
    </div>
  );
};

export default AddRoom;
