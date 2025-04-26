"use client";

import { Colors } from "@/enums/enums";
import { Box } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import React, { useMemo } from "react";
import * as THREE from "three";

const Wall = () => {
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: Colors.BLUE }),
    [],
  );

  // Wall segments definitions: [scale, position, rotation]
  const segments: Array<{
    scale: [number, number, number];
    position: [number, number, number];
    rotation?: [number, number, number];
  }> = [
    { scale: [17, 0.3, 0.1], position: [0, 0.15, 7.5] },
    { scale: [17, 0.3, 0.1], position: [0, 0.15, -7.5] },
    {
      scale: [5.5, 0.3, 0.1],
      position: [9.5, 0.15, 3.8],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      scale: [5.5, 0.3, 0.1],
      position: [9.5, 0.15, -3.8],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      scale: [5.5, 0.3, 0.1],
      position: [-9.5, 0.15, 3.8],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      scale: [5.5, 0.3, 0.1],
      position: [-9.5, 0.15, -3.8],
      rotation: [0, Math.PI / 2, 0],
    },
    // corners
    {
      scale: [1.4, 0.3, 0.1],
      position: [-9, 0.15, -7],
      rotation: [0, Math.PI / 4, 0],
    },
    {
      scale: [1.4, 0.3, 0.1],
      position: [9, 0.15, -7],
      rotation: [0, -Math.PI / 4, 0],
    },
    {
      scale: [1.4, 0.3, 0.1],
      position: [9, 0.15, 7],
      rotation: [0, Math.PI / 4, 0],
    },
    {
      scale: [1.4, 0.3, 0.1],
      position: [-9, 0.15, 7],
      rotation: [0, -Math.PI / 4, 0],
    },
    // goal walls
    {
      scale: [1.8, 0.3, 0.1],
      position: [9.9, 0.15, 0],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      scale: [1.8, 0.3, 0.1],
      position: [-9.9, 0.15, 0],
      rotation: [0, Math.PI / 2, 0],
    },
    { scale: [0.3, 0.3, 0.1], position: [9.8, 0.15, 0.95] },
    { scale: [0.3, 0.3, 0.1], position: [9.8, 0.15, -0.95] },
    { scale: [0.3, 0.3, 0.1], position: [-9.8, 0.15, 0.95] },
    { scale: [0.3, 0.3, 0.1], position: [-9.8, 0.15, -0.95] },
  ];

  return (
    <RigidBody type="fixed" colliders={false}>
      {segments.map(({ scale, position, rotation }, i) => (
        <React.Fragment key={i}>
          <Box
            scale={scale}
            position={position}
            rotation={rotation}
            material={material}
            castShadow
          />
          <CuboidCollider
            args={[scale[0] / 2, scale[1] / 2, scale[2] / 2]}
            position={position}
            rotation={rotation}
          />
        </React.Fragment>
      ))}
    </RigidBody>
  );
};

export default Wall;
