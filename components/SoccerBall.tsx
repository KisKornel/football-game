import React from "react";
import { RigidBody } from "@react-three/rapier";
import { Gltf } from "@react-three/drei";

export const SoccerBall = () => {
  return (
    <RigidBody name="ball" colliders="ball">
      <Gltf src="/models/Simple soccer football.glb" scale={0.18} castShadow />
    </RigidBody>
  );
};

export default SoccerBall;
