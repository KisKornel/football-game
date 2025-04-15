import React, { useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Gltf, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useParams } from "next/navigation";
import useCharactersStore from "@/store/charactersStore";
import * as THREE from "three";

export const SoccerBall = () => {
  const params = useParams<{ roomId: string; userId: string }>();
  const { userId } = params;

  const character = useCharactersStore((state) =>
    state.getCharactersById(userId),
  );

  const rb = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();

  useFrame(() => {
    if (rb.current && character && get().shoot) {
      const pos = rb.current.translation();
      const ballPosVect3 = new THREE.Vector3(pos.x, pos.y, pos.z);
      const characterPosVect3 = new THREE.Vector3(
        character.position.x,
        character.position.y,
        character.position.z,
      );

      if (ballPosVect3.distanceTo(characterPosVect3) < 0.5) {
        console.log("Shoot");
      }
    }
  });

  return (
    <RigidBody ref={rb} name="ball" colliders="ball">
      <Gltf src="/models/Simple soccer football.glb" scale={0.18} castShadow />
    </RigidBody>
  );
};

export default SoccerBall;
