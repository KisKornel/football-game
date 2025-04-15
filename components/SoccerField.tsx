"use client";

import { useState } from "react";
import { useGameChannelContext } from "@/contexts/GameChannelContext";
import { Gltf, useCursor } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useParams } from "next/navigation";

const SoccerField = () => {
  const params = useParams<{ roomId: string; userId: string }>();
  const { userId } = params;

  const { channel, isConnected } = useGameChannelContext();

  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (channel && isConnected && userId) {
      channel.send({
        type: "broadcast",
        event: "move-character",
        payload: { id: userId, position: { x: e.point.x, y: 0, z: e.point.z } },
      });
    }
  };

  return (
    <RigidBody type="fixed" name="soccer-field" position={[0, 0, 0]}>
      <Gltf
        src="/models/Floor Base.glb"
        scale={2}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
      />
    </RigidBody>
  );
};

export default SoccerField;
