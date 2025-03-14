import React, { useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import useGameStore from "@/store/gameStore";
import { useChannelContext } from "@/contexts/ChannelContext";

interface BallProps {
  setInterval: number;
  localPlayerId: string;
}

export const BallController = ({ localPlayerId, setInterval }: BallProps) => {
  const { onUpdateBall } = useChannelContext();
  const ball = useGameStore((state) => state.ball);
  const rb = useRef<RapierRigidBody>(null!);
  const interval = useRef(0);

  const interpolationFactor = 0.1;

  useFrame((_, delta) => {
    if (!rb.current) return;
    interval.current += delta;

    const currentLinVel = rb.current.linvel();
    const currentAngVel = rb.current.angvel();

    const interpolatedLinVel = {
      x:
        currentLinVel.x +
        (ball.velocity.x - currentLinVel.x) * interpolationFactor,
      y:
        currentLinVel.y +
        (ball.velocity.y - currentLinVel.y) * interpolationFactor,
      z:
        currentLinVel.z +
        (ball.velocity.z - currentLinVel.z) * interpolationFactor,
    };

    const interpolatedAngVel = {
      x:
        currentAngVel.x +
        (ball.angularVelocity.x - currentAngVel.x) * interpolationFactor,
      y:
        currentAngVel.y +
        (ball.angularVelocity.y - currentAngVel.y) * interpolationFactor,
      z:
        currentAngVel.z +
        (ball.angularVelocity.z - currentAngVel.z) * interpolationFactor,
    };

    rb.current.setLinvel(interpolatedLinVel, true);
    rb.current.setAngvel(interpolatedAngVel, true);

    if (interval.current > setInterval) {
      const position = rb.current.translation();
      const velocity = rb.current.linvel();
      const angularVelocity = rb.current.angvel();

      const data = {
        position: { x: position.x, y: position.y, z: position.z },
        velocity: { x: velocity.x, y: velocity.y, z: velocity.z },
        angularVelocity: {
          x: angularVelocity.x,
          y: angularVelocity.y,
          z: angularVelocity.z,
        },
        controlledBy: localPlayerId,
      };

      onUpdateBall(data);

      interval.current = 0;
    }
  });

  return (
    <RigidBody name="ball" ref={rb} type="dynamic" colliders="ball">
      <mesh>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color={ball.color} />
      </mesh>
    </RigidBody>
  );
};

export default BallController;
