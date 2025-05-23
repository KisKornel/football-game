"use client";

import { Suspense, useMemo, useState } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Box, Text } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { Colors } from "@/enums/enums";
import * as THREE from "three";
import { TeamType } from "@/types/types";
import { useParams } from "next/navigation";
import { getSocket } from "@/socket";

interface SoccerGoalProps {
  team: TeamType;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

const SoccerGoal = ({ position, rotation, team }: SoccerGoalProps) => {
  const params = useParams<{ roomId: string; userId: string }>();
  const { roomId } = params;
  const socket = getSocket();
  const [hasScored, setHasScored] = useState(false);
  const [intersecting, setIntersection] = useState(false);

  const pos = useMemo(
    () => new THREE.Vector3(position.x, position.y, position.z),
    [position.x, position.y, position.z],
  );
  const rot = useMemo(
    () => new THREE.Euler(rotation.x, rotation.y, rotation.z),
    [rotation.x, rotation.y, rotation.z],
  );

  const material = useMemo(
    () => new MeshStandardMaterial({ color: "#ffffff" }),
    [],
  );

  const handleOnIntersectionEnter = async () => {
    if (hasScored) return;
    setHasScored(true);
    setIntersection(true);
    socket.emit("goal-scored", { roomId, team });
  };

  const handleOnIntersectionExit = () => {
    setTimeout(() => {
      setIntersection(false);
    }, 3000);
    setHasScored(false);
  };

  return (
    <RigidBody type="fixed" position={pos} rotation={rot}>
      <Box
        scale={[2.2, 0.2, 0.2]}
        position={[0, 1, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[0.2, 1, 0.2]}
        position={[-1, 0.5, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[0.2, 1, 0.2]}
        position={[1, 0.5, 0]}
        material={material}
        castShadow
      />

      <Suspense fallback={null}>
        {intersecting && (
          <Text color={Colors.RED} position={[0, 5, 0]} fontSize={2}>
            Góóól
          </Text>
        )}
      </Suspense>

      <CuboidCollider
        position={[0, 0.45, 0.15]}
        args={[0.9, 0.45, 0.15]}
        sensor
        onIntersectionEnter={handleOnIntersectionEnter}
        onIntersectionExit={handleOnIntersectionExit}
      />
    </RigidBody>
  );
};

export default SoccerGoal;
