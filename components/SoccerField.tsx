"use client";

import { useState } from "react";
import { Gltf, useCursor } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useParams } from "next/navigation";
import { getSocket } from "@/socket";

const SoccerField = () => {
  const params = useParams<{ roomId: string; userId: string }>();
  const { roomId, userId } = params;
  const socket = getSocket();

  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    const payload = {
      id: userId,
      position: { x: e.point.x, y: 0, z: e.point.z },
      roomId,
    };
    socket.emit("move-character", payload);
  };

  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
      name="soccer-field"
      position={[0, 0, 0]}
    >
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
