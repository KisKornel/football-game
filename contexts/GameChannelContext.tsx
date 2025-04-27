"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import useCharactersStore from "@/store/charactersStore";
import { getSocket } from "@/socket";
import { BallType, CharacterType, TeamType } from "@/types/types";
import useGameStore from "@/store/gameStore";

interface GameChannelContextProps {
  transport: string;
  isConnected: boolean;
}

interface GameChannelProviderProps {
  roomId: string;
  children: ReactNode;
}

const GameChannelContext = createContext<GameChannelContextProps>({
  transport: "N/A",
  isConnected: false,
});

export const GameChannelProvider = ({
  roomId,
  children,
}: GameChannelProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const updateCharacter = useCharactersStore((state) => state.updateCharacter);
  const setBall = useGameStore((state) => state.setBall);
  const increaseHome = useGameStore((state) => state.increaseHome);
  const increaseAway = useGameStore((state) => state.increaseAway);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.emit("join-room", roomId);
    };
    const onDisconnect = () => {
      setIsConnected(false);
      setTransport("N/A");
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUpgrade = (t: any) => setTransport(t.name);

    const onPlayerMoved = (
      data: Pick<CharacterType, "id" | "position" | "roomId">,
    ) => {
      console.log("Player moved: ", data);
      updateCharacter(data);
    };

    const onBallMoved = ({ position, velocity, rotation }: BallType) => {
      setBall({ position, velocity, rotation });
    };

    const onGoalScored = ({ team }: { team: TeamType }) => {
      console.log("Goal team: ", team);

      if (team === "home") {
        increaseHome();
      } else {
        increaseAway();
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.io.engine.on("upgrade", onUpgrade);
    socket.on("playerMoved", onPlayerMoved);
    socket.on("world-tick", onBallMoved);
    socket.on("goal-scored", onGoalScored);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.io.engine.off("upgrade", onUpgrade);
      socket.off("playerMoved", onPlayerMoved);
      socket.off("world-tick", onBallMoved);
      socket.off("goal-scored", onGoalScored);
    };
  }, [increaseAway, increaseHome, roomId, setBall, updateCharacter]);

  return (
    <GameChannelContext.Provider
      value={{
        transport,
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
