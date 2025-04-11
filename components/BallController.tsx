import React, { useMemo, useRef } from "react";
import {
  CollisionEnterPayload,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import useGameStore from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";
import { useChannelContext } from "@/contexts/ChannelContext";
import * as THREE from "three";

interface HostBallControllerProps {
  ballRadius: number;
  localPlayerId: string;
}

export const BallController = ({
  ballRadius,
  localPlayerId,
}: HostBallControllerProps) => {
  const { onUpdateBall } = useChannelContext();

  const ball = useGameStore((state) => state.ball);
  const updateBall = useGameStore((state) => state.updateBall);

  const color = useMemo(() => ball.color, [ball.color]);

  const rb = useRef<RapierRigidBody>(null!);

  const currentPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());

  const handleCollisionEnter = (payload: CollisionEnterPayload) => {
    const otherObject = payload.rigidBodyObject;

    if (otherObject && otherObject.userData && otherObject.userData.playerId) {
      const playerId = otherObject.userData.playerId;

      const pos = rb.current.translation();
      const newPosition = {
        x: pos.x,
        y: pos.y,
        z: pos.z,
      };

      updateBall({
        position: newPosition,
        lastTouchedBy: playerId,
        lastUpdate: new Date().toISOString(),
      });
      onUpdateBall({
        position: newPosition,
        lastTouchedBy: playerId,
        lastUpdate: new Date().toISOString(),
      });
    }
  };

  useFrame(() => {
    if (rb.current && ball.lastTouchedBy) {
      const pos = rb.current.translation();

      if (ball.lastTouchedBy === localPlayerId) {
        const newPosition = {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        };

        onUpdateBall({
          position: newPosition,
          lastUpdate: new Date().toISOString(),
        });
      } else {
        console.log("Ball: ", ball);

        targetPos.current.set(
          ball.position.x,
          ball.position.y,
          ball.position.z,
        );
        currentPos.current.set(pos.x, pos.y, pos.z);

        const newPos = currentPos.current.lerp(targetPos.current, 0.1);
        rb.current.setTranslation(newPos, true);
      }
    }
  });

  return (
    <RigidBody
      name="ball"
      ref={rb}
      colliders="ball"
      type="dynamic"
      position={[ball.position.x, ball.position.y, ball.position.z]}
      onCollisionEnter={handleCollisionEnter}
    >
      <mesh>
        <sphereGeometry args={[ballRadius]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};

export default BallController;
