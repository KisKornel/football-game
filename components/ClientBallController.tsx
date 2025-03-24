import useGameStore from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

interface ClientBallControllerProps {
  ballRadius: number;
}

const ClientBallController = ({ ballRadius }: ClientBallControllerProps) => {
  const ball = useGameStore((state) => state.ball);
  const color = useMemo(() => ball.color, [ball.color]);

  const rb = useRef<RapierRigidBody>(null!);
  const currentPosition = useRef(new THREE.Vector3(0, 10, 0));

  useFrame(() => {
    if (rb.current && currentPosition.current) {
      const targetVector = new THREE.Vector3(
        ball.position.x,
        ball.position.y,
        ball.position.z
      );

      currentPosition.current.lerp(targetVector, 0.1);

      rb.current.setNextKinematicTranslation({
        x: currentPosition.current.x,
        y: currentPosition.current.y,
        z: currentPosition.current.z,
      });
    }
  });

  return (
    <RigidBody
      name="ball"
      ref={rb}
      colliders="ball"
      type="kinematicPosition"
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

export default ClientBallController;
