"use client";

import { Colors } from "@/enums/enums";
import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React, { useMemo } from "react";
import { MeshStandardMaterial } from "three";

const Wall = () => {
  const material = useMemo(
    () => new MeshStandardMaterial({ color: Colors.BLUE }),
    [],
  );

  return (
    <RigidBody type="fixed">
      <Box
        scale={[17, 0.3, 0.1]}
        position={[0, 0.15, 7.5]}
        material={material}
        castShadow
      />
      <Box
        scale={[17, 0.3, 0.1]}
        position={[0, 0.15, -7.5]}
        material={material}
        castShadow
      />

      <Box
        scale={[5.5, 0.3, 0.1]}
        position={[9.5, 0.15, 3.8]}
        rotation={[0, Math.PI / 2, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[5.5, 0.3, 0.1]}
        position={[9.5, 0.15, -3.8]}
        rotation={[0, Math.PI / 2, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[5.5, 0.3, 0.1]}
        position={[-9.5, 0.15, 3.8]}
        rotation={[0, Math.PI / 2, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[5.5, 0.3, 0.1]}
        position={[-9.5, 0.15, -3.8]}
        rotation={[0, Math.PI / 2, 0]}
        material={material}
        castShadow
      />

      {/** Corners */}
      <Box
        scale={[1.4, 0.3, 0.1]}
        position={[-9, 0.15, -7]}
        rotation={[0, Math.PI / 4, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[1.4, 0.3, 0.1]}
        position={[9, 0.15, -7]}
        rotation={[0, -Math.PI / 4, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[1.4, 0.3, 0.1]}
        position={[9, 0.15, 7]}
        rotation={[0, Math.PI / 4, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[1.4, 0.3, 0.1]}
        position={[-9, 0.15, 7]}
        rotation={[0, -Math.PI / 4, 0]}
        material={material}
        castShadow
      />

      {/** Goal Wall */}
      <Box
        scale={[1.8, 0.3, 0.1]}
        position={[9.9, 0.15, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[1.8, 0.3, 0.1]}
        position={[-9.9, 0.15, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[0.3, 0.3, 0.1]}
        position={[9.8, 0.15, 0.95]}
        rotation={[0, 0, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[0.3, 0.3, 0.1]}
        position={[9.8, 0.15, -0.95]}
        rotation={[0, 0, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[0.3, 0.3, 0.1]}
        position={[-9.8, 0.15, 0.95]}
        rotation={[0, 0, 0]}
        material={material}
        castShadow
      />
      <Box
        scale={[0.3, 0.3, 0.1]}
        position={[-9.8, 0.15, -0.95]}
        rotation={[0, 0, 0]}
        material={material}
        castShadow
      />
    </RigidBody>
  );
};

export default Wall;
