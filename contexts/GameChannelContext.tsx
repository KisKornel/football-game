import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { supabase } from "@/utils/supabase/server";
import { RealtimeChannel } from "@supabase/supabase-js";
import useCharactersStore from "@/store/charactersStore";
import useGameStore from "@/store/gameStore";

interface GameChannelContextProps {
  channel: RealtimeChannel | null;
  isConnected: boolean;
}

interface GameChannelProviderProps {
  roomId: string;
  children: ReactNode;
}

const GameChannelContext = createContext<GameChannelContextProps | null>(null);

export const GameChannelProvider = ({
  roomId,
  children,
}: GameChannelProviderProps) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const updateCharacter = useCharactersStore((state) => state.updateCharacter);
  const increaseHome = useGameStore((state) => state.increaseHome);
  const increaseAway = useGameStore((state) => state.increaseAway);
  const resetBallPosition = useGameStore((state) => state.resetBallPosition);

  useEffect(() => {
    console.log("Game channel is connecting...");

    if (channel || isConnected) return;

    const newChannel = supabase.channel(`game-${roomId}-channel`, {
      config: {
        broadcast: {
          self: true,
        },
      },
    });

    const subscription = newChannel
      .on("broadcast", { event: "move-character" }, ({ payload }) => {
        console.log("Move character: ", payload);

        updateCharacter(payload);
      })
      .on("broadcast", { event: "increase-score" }, ({ payload }) => {
        console.log("Increase score: ", payload);

        if (payload.team === "home") {
          increaseHome();
        } else {
          increaseAway();
        }

        resetBallPosition();
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setChannel(newChannel);
          setIsConnected(true);

          console.log("Game channel connected!");
        }
      });

    return () => {
      subscription.unsubscribe();
      newChannel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, updateCharacter]);

  return (
    <GameChannelContext.Provider
      value={{
        channel,
        isConnected,
      }}
    >
      {children}
    </GameChannelContext.Provider>
  );
};

export const useGameChannelContext = () => {
  const context = useContext(GameChannelContext);
  if (!context) {
    throw new Error(
      "useGameChannelContext must be used within a GameChannelProvider",
    );
  }
  return context;
};
