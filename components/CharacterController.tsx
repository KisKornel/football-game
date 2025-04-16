"use client";

import React, { useMemo, useRef, useState } from "react";
import { ActionName, Character } from "./Character";
import * as THREE from "three";
import { CharacterType } from "@/types/types";
import { useFrame } from "@react-three/fiber";

interface CharacterControllerProps {
  character: CharacterType;
}

const MOVEMENT_SPEED = 0.032;

export const CharacterController = ({
  character,
}: CharacterControllerProps) => {
  const initialPosition = useMemo(
    () =>
      new THREE.Vector3(
        character.position.x,
        character.position.y,
        character.position.z,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const characterRef = useRef<THREE.Group | null>(null);

  const [animation, setAnimation] = useState<ActionName>(
    "HumanArmature|Man_Idle",
  );

  useFrame(() => {
    if (characterRef.current) {
      const target = new THREE.Vector3(
        character.position.x,
        character.position.y,
        character.position.z,
      );

      if (characterRef.current.position.distanceTo(target) > 0.1) {
        const direction = characterRef.current.position
          .clone()
          .sub(target)
          .normalize()
          .multiplyScalar(MOVEMENT_SPEED);
        characterRef.current.position.sub(direction);
        characterRef.current.lookAt(target);

        setAnimation("HumanArmature|Man_Run");
      } else {
        setAnimation("HumanArmature|Man_Idle");
      }
    }
  });

  return (
    <group
      ref={characterRef}
      position={initialPosition}
      name={`user-${character.id}`}
    >
      <Character
        hairColor={character.hairColor}
        shirtColor={character.shirtColor}
        pantsColor={character.pantsColor}
        animation={animation}
      />
    </group>
  );
};
