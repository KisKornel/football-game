"use client";

import React from "react";
import { useParams } from "next/navigation";
import { GameChannelProvider } from "@/contexts/GameChannelContext";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  const params = useParams<{ roomId: string }>();
  const { roomId } = params;

  return <GameChannelProvider roomId={roomId}>{children}</GameChannelProvider>;
}
