/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Character } from "./Character";
import { Controls } from "@/enums/enums";
import * as THREE from "three";
import { lerpAngle } from "@/utils/functions/functions";
import { degToRad } from "three/src/math/MathUtils.js";
import { PlayerType } from "@/types/types";
import { useChannelContext } from "@/contexts/ChannelContext";

interface CharacterControllerProps {
  player: PlayerType;
  isLocal: boolean;
  rotationSpeed: number;
  walkSpeed: number;
}

export const CharacterController = ({
  isLocal,
  player,
  rotationSpeed,
  walkSpeed,
}: CharacterControllerProps) => {
  const { onUpdatePlayer } = useChannelContext();
  const color = useMemo(() => player.color, []);

  const rb = useRef<RapierRigidBody>(null!);
  const container = useRef<THREE.Group>(null!);
  const character = useRef<THREE.Group>(null!);
  const cameraTarget = useRef<THREE.Group>(null!);
  const cameraPosition = useRef<THREE.Group>(null!);

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);

  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());
  const vecTargetPos = useRef(new THREE.Vector3());
  const vecCurrentPos = useRef(new THREE.Vector3());

  const lastNetworkUpdate = useRef(0);

  const [, get] = useKeyboardControls<Controls>();

  useFrame(({ camera, clock }) => {
    if (rb.current) {
      const position = rb.current.translation();
      const currentTime = clock.getElapsedTime() * 1000;

      if (isLocal) {
        const vel = rb.current.linvel();

        if (currentTime - lastNetworkUpdate.current > 50) {
          lastNetworkUpdate.current = currentTime;
          const rotationY = character.current.rotation.y;
          onUpdatePlayer({
            id: player.id,
            position: { x: position.x, y: position.y, z: position.z },
            rotation: rotationY,
          });
        }

        const movement = { x: 0, z: 0 };

        if (get().forward) movement.z = 1;
        if (get().backward) movement.z = -1;
        if (get().left) movement.x = 1;
        if (get().right) movement.x = -1;

        if (movement.x !== 0) {
          rotationTarget.current += degToRad(rotationSpeed) * movement.x;
        }

        if (movement.x !== 0 || movement.z !== 0) {
          characterRotationTarget.current = Math.atan2(movement.x, movement.z);
          vel.x =
            Math.sin(rotationTarget.current + characterRotationTarget.current) *
            walkSpeed;
          vel.z =
            Math.cos(rotationTarget.current + characterRotationTarget.current) *
            walkSpeed;
        }

        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          characterRotationTarget.current,
          0.1
        );

        rb.current.setLinvel(vel, true);

        //Camera
        container.current.rotation.y = THREE.MathUtils.lerp(
          container.current.rotation.y,
          rotationTarget.current,
          0.1
        );

        cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
        camera.position.lerp(cameraWorldPosition.current, 0.1);

        if (cameraTarget.current) {
          cameraTarget.current.getWorldPosition(
            cameraLookAtWorldPosition.current
          );
          cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
          camera.lookAt(cameraLookAt.current);
        }
      } else {
        vecTargetPos.current.set(
          player.position.x,
          player.position.y,
          player.position.z
        );
        vecCurrentPos.current.set(position.x, position.y, position.z);

        const newPos = vecCurrentPos.current.lerp(vecTargetPos.current, 0.1);
        rb.current.setTranslation(newPos, true);

        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          player.rotation,
          0.1
        );
      }
    }
  });

  return (
    <RigidBody
      colliders="cuboid"
      type="dynamic"
      lockRotations
      ref={rb}
      position={[player.position.x, player.position.y, player.position.z]}
      name="player"
      userData={{ playerId: player.id }}
    >
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-4} />
        <group ref={character}>
          <Character color={color} />
        </group>
      </group>
    </RigidBody>
  );
};
