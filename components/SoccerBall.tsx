"use client";

import React, { useRef } from "react";
import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Gltf } from "@react-three/drei";
import useGameStore from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const SoccerBall = () => {
  const rb = useRef<RapierRigidBody>(null);
  const ball = useGameStore((state) => state.ball);

  useFrame(() => {
    if (!rb.current) return;
    rb.current.setTranslation(
      {
        x: ball.position.x,
        y: ball.position.y,
        z: ball.position.z,
      },
      true,
    );
    rb.current.setNextKinematicRotation(
      new THREE.Quaternion(
        ball.rotation.x,
        ball.rotation.y,
        ball.rotation.z,
        ball.rotation.w,
      ),
    );
  });

  return (
    <RigidBody
      ref={rb}
      name="ball"
      colliders={false}
      type="dynamic"
      gravityScale={0}
    >
      <BallCollider args={[0.135]} />
      <Gltf src="/models/Simple soccer football.glb" scale={0.18} castShadow />
    </RigidBody>
  );
};

export default SoccerBall;
