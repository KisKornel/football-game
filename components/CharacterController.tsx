/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { MathUtils, Vector3 } from "three";
import { Character } from "./Character";
import { Controls } from "@/enums/enums";
import * as THREE from "three";
import { calculateImpulse, lerpAngle } from "@/utils/functions/functions";
import { degToRad } from "three/src/math/MathUtils.js";
import { PlayerType } from "@/types/types";
import { useChannelContext } from "@/contexts/ChannelContext";
import useGameStore from "@/store/gameStore";

interface CharacterControllerProps {
  player: PlayerType;
  isLocal: boolean;
  rotationSpeed: number;
  walkSpeed: number;
}

const KICK_THRESHOLD = 5;

export const CharacterController = ({
  isLocal,
  player,
  rotationSpeed,
  walkSpeed,
}: CharacterControllerProps) => {
  const { onUpdatePlayer, onBallInteractions } = useChannelContext();
  const color = useMemo(() => player.color, []);
  const ball = useGameStore((state) => state.ball);

  const rb = useRef<RapierRigidBody>(null!);
  const container = useRef<THREE.Group>(null!);
  const character = useRef<THREE.Group>(null!);

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<THREE.Group>(null!);
  const cameraPosition = useRef<THREE.Group>(null!);
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const vecTargetPos = new THREE.Vector3();
  const vecCurrentPos = new THREE.Vector3();

  const [, get] = useKeyboardControls<Controls>();

  useFrame(({ camera }) => {
    if (rb.current) {
      if (isLocal) {
        const vel = rb.current.linvel();
        const movement = { x: 0, z: 0 };

        if (get().forward) movement.z = 1;
        if (get().backward) movement.z = -1;
        if (get().left) movement.x = 1;
        if (get().right) movement.x = -1;

        if (get().kick) {
          const pos = rb.current.translation();

          const currentPlayerPos = new Vector3(pos.x, pos.y, pos.z);
          const currentBallPos = new Vector3(
            ball.position.x,
            ball.position.y,
            ball.position.z
          );

          if (currentBallPos.distanceTo(currentPlayerPos) <= KICK_THRESHOLD) {
            console.log("Kick");

            const force = calculateImpulse(
              currentBallPos,
              currentPlayerPos,
              KICK_THRESHOLD
            );

            onBallInteractions(force);
          }
        }

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

        const position = rb.current.translation();
        const rotationY = character.current.rotation.y;

        onUpdatePlayer({
          id: player.id,
          position: { x: position.x, y: position.y, z: position.z },
          rotation: rotationY,
        });

        //Camera
        container.current.rotation.y = MathUtils.lerp(
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
        const targetPos = vecTargetPos.set(
          player.position.x,
          player.position.y,
          player.position.z
        );

        const currentTranslation = rb.current.translation();
        const currentPos = vecCurrentPos.set(
          currentTranslation.x,
          currentTranslation.y,
          currentTranslation.z
        );

        if (currentPos.distanceTo(targetPos) > 0.1) {
          const newPos = currentPos.lerp(targetPos, 0.1);
          rb.current.setTranslation(newPos, true);
        }

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
