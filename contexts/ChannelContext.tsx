import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { supabase } from "@/utils/supabase/server";
import { RealtimeChannel } from "@supabase/supabase-js";
import { BallType, PlayerType, RoomType } from "@/types/types";
import useGameStore from "@/store/gameStore";

interface ChannelContextProps {
  isConnected: boolean;
  isStartGame: boolean;
  onUpdatePlayer: (data: Partial<PlayerType>) => void;
  onUpdateBall: (data: Omit<BallType, "id" | "color">) => void;
  onDeletePlayer: (id: string) => void;
}

interface ChannelProviderProps {
  roomId: string;
  children: ReactNode;
}

const MAX_GAME_MEMBERS = 2;

const ChannelContext = createContext<ChannelContextProps | undefined>(
  undefined
);

export const ChannelProvider = ({ roomId, children }: ChannelProviderProps) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const deletedPlayer = new Set<string>("");

  const addPlayer = useGameStore((state) => state.addPlayer);
  const updatePlayer = useGameStore((state) => state.updatePlayer);
  const deletePlayer = useGameStore((state) => state.deletePlayer);
  const updateBall = useGameStore((state) => state.updateBall);
  const updateRoom = useGameStore((state) => state.updateRoom);

  const [isStartGame, setIsStartGame] = useState(false);

  useEffect(() => {
    const getPlayers = async () => {
      console.log("Get all players");

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomId);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        data.forEach((player) => addPlayer(player.id, player));
      }
    };

    getPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (channel || isConnected) return;

    const newChannel = supabase.channel(`room-${roomId}-channel`);

    const subscription = newChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const { id, ...data } = payload.new as RoomType;
            updateRoom(id, { ...data });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("INSERT User: ", payload.new);

            const { id, ...data } = payload.new as PlayerType;

            addPlayer(id, { id, ...data });
          }

          if (payload.eventType === "UPDATE") {
            console.log("UPDATE User: ", payload.new);

            const { id, ...data } = payload.new as PlayerType;

            updatePlayer(id, { ...data });

            if (data.ready) {
              checkIfAllPlayersReady();
            }
          }

          if (payload.eventType === "DELETE") {
            console.log("DELETE User: ", payload.old);

            const { id } = payload.old as PlayerType;

            deletePlayer(id);
          }
        }
      )
      .on("broadcast", { event: "update_player" }, ({ payload }) => {
        const { id, ...data } = payload as PlayerType;

        if (deletedPlayer.has(id)) return;

        updatePlayer(id, { ...data });
      })
      .on("broadcast", { event: "delete_player" }, ({ payload }) => {
        const { id } = payload as PlayerType;

        deletedPlayer.add(id);
        deletePlayer(id);
      })
      .on("broadcast", { event: "update_ball" }, ({ payload }) => {
        updateBall(payload);
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
  }, [roomId]);

  const checkIfAllPlayersReady = async () => {
    console.log("Checking...");

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("room_id", roomId)
      .eq("ready", true);

    if (error) {
      console.log("Error check all players is ready: ", error);
    }

    if (data && data.length === MAX_GAME_MEMBERS) {
      console.log("All players are ready! Starting the game...");
      setIsStartGame(true);
    }
  };

  const onUpdatePlayer = (data: Partial<PlayerType>) => {
    channel?.send({
      type: "broadcast",
      event: "update_player",
      payload: data,
    });
  };

  const onDeletePlayer = (id: string) => {
    console.log("Delete player with ID: ", id);

    channel?.send({
      type: "broadcast",
      event: "delete_player",
      payload: {
        id,
      },
    });
  };

  const onUpdateBall = (data: Omit<BallType, "id" | "color">) => {
    channel?.send({
      type: "broadcast",
      event: "update_ball",
      payload: {
        position: {
          x: data.position.x,
          y: data.position.y,
          z: data.position.z,
        },
        velocity: {
          x: data.velocity.x,
          y: data.velocity.y,
          z: data.velocity.z,
        },
        angularVelocity: {
          x: data.angularVelocity.x,
          y: data.angularVelocity.y,
          z: data.angularVelocity.z,
        },
        controlledBy: data.controlledBy,
      } as BallType,
    });
  };

  return (
    <ChannelContext.Provider
      value={{
        isConnected,
        isStartGame,
        onUpdatePlayer,
        onDeletePlayer,
        onUpdateBall,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannelContext = () => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error("useChannelContext must be used within a ChannelProvider");
  }
  return context;
};
