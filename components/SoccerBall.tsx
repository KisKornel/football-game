import React, { useEffect, useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Gltf } from "@react-three/drei";
import * as THREE from "three";
import useCharactersStore from "@/store/charactersStore";

export const SoccerBall = () => {
  const rb = useRef<RapierRigidBody>(null);
  const ballRef = useRef<THREE.Group | null>(null);

  const characters = useCharactersStore((state) => state.characters);

  useEffect(() => {
    if (characters) {
      characters.map((c) => {
        if (rb.current) {
          console.log("van");

          const pos = rb.current.translation();
          const ballPosVect3 = new THREE.Vector3(pos.x, pos.y, pos.z);
          const characterVect3 = new THREE.Vector3(
            c.position.x,
            c.position.y,
            c.position.z,
          );

          if (characterVect3.distanceTo(ballPosVect3) < 0.5) {
            console.log("Kick ball");

            const direction = ballPosVect3
              .clone()
              .sub(characterVect3)
              .normalize()
              .multiplyScalar(0.05);

            const impulse = {
              x: direction.x,
              y: 0,
              z: direction.z,
            };

            rb.current.applyImpulse(impulse, true);
          }
        }
      });
    }
  }, [characters]);

  return (
    <RigidBody ref={rb} name="ball" colliders="ball">
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
