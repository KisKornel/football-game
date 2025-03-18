import React, { useMemo, useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import useGameStore from "@/store/gameStore";

interface BallControllerProps {
  ballRadius: number;
}

export const BallController = ({ ballRadius }: BallControllerProps) => {
  const rb = useRef<RapierRigidBody>(null!);

  const ball = useGameStore((state) => state.ball);

  const color = useMemo(() => ball.color, [ball.color]);

  return (
    <RigidBody name="ball" ref={rb} type="dynamic" colliders="ball" mass={1}>
      <mesh>
        <sphereGeometry args={[ballRadius]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};

export default BallController;
