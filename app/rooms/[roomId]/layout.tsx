"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ChannelProvider } from "@/contexts/ChannelContext";

interface RoomLayoutProps {
  children: React.ReactNode;
}

export default function RoomLayout({ children }: RoomLayoutProps) {
  const params = useParams<{ roomId: string }>();
  const { roomId } = params;

  return <ChannelProvider roomId={roomId}>{children}</ChannelProvider>;
}
