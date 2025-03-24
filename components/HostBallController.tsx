import React, { useEffect, useMemo, useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import useGameStore from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";
import { useChannelContext } from "@/contexts/ChannelContext";

interface HostBallControllerProps {
  ballRadius: number;
}

export const HostBallController = ({ ballRadius }: HostBallControllerProps) => {
  const { channel, onUpdateBall } = useChannelContext();
  const rb = useRef<RapierRigidBody>(null!);

  const ball = useGameStore((state) => state.ball);

  const color = useMemo(() => ball.color, [ball.color]);

  useEffect(() => {
    if (channel) {
      channel.on("broadcast", { event: "interactions_ball" }, ({ payload }) => {
        console.log("Kick ball: ", payload);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    if (rb.current) {
      const translation = rb.current.translation();

      const newPosition = {
        x: translation.x,
        y: translation.y,
        z: translation.z,
      };

      onUpdateBall({ position: newPosition });
    }
  });

  return (
    <RigidBody
      name="ball"
      ref={rb}
      colliders="ball"
      position={[ball.position.x, ball.position.y, ball.position.z]}
      mass={1}
    >
      <mesh>
        <sphereGeometry args={[ballRadius]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};

export default HostBallController;
