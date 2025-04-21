import React, { useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Gltf } from "@react-three/drei";
import * as THREE from "three";

export const SoccerBall = () => {
  const rb = useRef<RapierRigidBody>(null);
  const ballRef = useRef<THREE.Group | null>(null);

  return (
    <RigidBody ref={rb} name="ball" colliders="ball" restitution={1}>
      <Gltf
        ref={ballRef}
        src="/models/Simple soccer football.glb"
        scale={0.18}
        castShadow
      />
    </RigidBody>
  );
};

export default SoccerBall;
