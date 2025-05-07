import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/utils/supabase/server";
import { RealtimeChannel } from "@supabase/supabase-js";
import useCharactersStore from "@/store/charactersStore";
import { CharacterType } from "@/types/types";
import { gameConfig } from "@/config/gameConfig";

interface ChannelContextProps {
  channel: RealtimeChannel | null;
  isConnected: boolean;
  isStartGame: boolean;
}

interface ChannelProviderProps {
  roomId: string;
  children: ReactNode;
}

const ChannelContext = createContext<ChannelContextProps | null>(null);

export const ChannelProvider = ({ roomId, children }: ChannelProviderProps) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const addCharacter = useCharactersStore((state) => state.addCharacter);
  const removeCharacter = useCharactersStore((state) => state.removeCharacter);
  const updateCharacter = useCharactersStore((state) => state.updateCharacter);
  const setCharacters = useCharactersStore((state) => state.setCharacters);

  const [isStartGame, setIsStartGame] = useState(false);

  const getAllCharacters = useCallback(async () => {
    if (!roomId) return;

    try {
      const { data: characters, error } = await supabase
        .from("characters")
        .select("*");

      if (error) {
        throw new Error("Get all character error!");
      }

      if (characters && characters.length > 0) {
        setCharacters(characters);
      }
    } catch (error) {
      console.log(error);
    }
  }, [roomId, setCharacters]);

  useEffect(() => {
    getAllCharacters();
  }, [getAllCharacters]);

  useEffect(() => {
    console.log("Channel is connecting...");

    if (channel || isConnected) return;

    const newChannel = supabase.channel(`room-${roomId}-channel`, {
      config: {
        broadcast: {
          self: true,
        },
      },
    });

    const subscription = newChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "characters",
          filter: `roomId=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const data = payload.new;
            console.log("Insert character: ", data);

            addCharacter(data as CharacterType);
          }

          if (payload.eventType === "UPDATE") {
            const data = payload.new;
            console.log("Update character: ", data);

            updateCharacter(data as CharacterType);

            if (data.ready) {
              checkIfAllPlayersReady();
            }
          }
        },
      )
      .on("broadcast", { event: "delete-character" }, ({ payload }) => {
        console.log("Delete character: ", payload);

        removeCharacter(payload.id);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setChannel(newChannel);
          setIsConnected(true);

          console.log("Channel connected!");
        }
      });

    return () => {
      subscription.unsubscribe();
      newChannel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addCharacter, roomId, updateCharacter]);

  const checkIfAllPlayersReady = async () => {
    console.log("Checking...");

    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("roomId", roomId)
      .eq("ready", true);

    if (error) {
      console.log("Error check all players is ready: ", error);
    }

    if (data && data.length === gameConfig.maxTeamSize * 2) {
      console.log("All players are ready! Starting the game...");
      setIsStartGame(true);
    }
  };

  return (
    <ChannelContext.Provider
      value={{
        channel,
        isConnected,
        isStartGame,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannelContext = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error("useChannelContext must be used within a ChannelProvider");
  }
  return context;
};
