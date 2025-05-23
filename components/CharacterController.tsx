"use client";

import React, { useMemo, useRef, useState } from "react";
import { ActionName, Character } from "./Character";
import * as THREE from "three";
import { CharacterType } from "@/types/types";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  CollisionEnterPayload,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { getSocket } from "@/socket";
import { useParams } from "next/navigation";
import { gameConfig } from "@/config/gameConfig";

interface CharacterControllerProps {
  character: CharacterType;
}

export const CharacterController = ({
  character,
}: CharacterControllerProps) => {
  const params = useParams<{ roomId: string; userId: string }>();
  const { roomId } = params;
  const socket = getSocket();

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

  const rb = useRef<RapierRigidBody>(null);
  const [animation, setAnimation] = useState<ActionName>(
    "HumanArmature|Man_Idle",
  );

  const onCollision = (e: CollisionEnterPayload) => {
    if (
      roomId &&
      rb.current &&
      e.other.rigidBodyObject &&
      e.other.rigidBodyObject.name === "ball"
    ) {
      const p = rb.current.translation();
      const b = e.other.rigidBodyObject.position;

      const dir = {
        x: b.x - p.x,
        y: 0.02,
        z: b.z - p.z,
      };

      const len = Math.hypot(dir.x, dir.z);
      if (len === 0) return;
      dir.x /= len;
      dir.z /= len;

      const impulse = {
        x: dir.x * gameConfig.ballImpulse,
        y: dir.y,
        z: dir.z * gameConfig.ballImpulse,
      };

      socket.emit("hit-ball", { roomId, force: impulse });
    }
  };

  useFrame((_, delta) => {
    if (!rb.current) return;
    const pos = rb.current.translation();

    const currPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    const target = new THREE.Vector3(
      character.position.x,
      character.position.y,
      character.position.z,
    );

    const toTarget = target.clone().sub(currPos);
    const distance = toTarget.length();

    if (distance > 0) {
      const dir = toTarget.normalize();
      const step = gameConfig.movementSpeed * delta;
      const isMoving = distance > step;

      const nextPos =
        distance <= step
          ? target
          : currPos.clone().add(dir.multiplyScalar(step));

      rb.current.setNextKinematicTranslation({
        x: nextPos.x,
        y: nextPos.y,
        z: nextPos.z,
      });

      setAnimation(
        distance > 0.1 ? "HumanArmature|Man_Run" : "HumanArmature|Man_Idle",
      );

      if (isMoving) {
        const dx = target.x - currPos.x;
        const dz = target.z - currPos.z;
        const heading = Math.atan2(dx, dz);
        const quat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, heading, 0, "YXZ"),
        );
        rb.current.setNextKinematicRotation({
          x: quat.x,
          y: quat.y,
          z: quat.z,
          w: quat.w,
        });
      }
    }
  });

  return (
    <RigidBody
      ref={rb}
      type="kinematicPosition"
      colliders={false}
      enabledRotations={[false, false, false]}
      position={initialPosition}
      onCollisionEnter={onCollision}
      name={`player-${character.id}`}
    >
      <CapsuleCollider args={[0.7, 0.2]} position={[0, 0.6, 0]} />

      <Character
        hairColor={character.hairColor}
        shirtColor={character.shirtColor}
        pantsColor={character.pantsColor}
        animation={animation}
      />
    </RigidBody>
  );
};
