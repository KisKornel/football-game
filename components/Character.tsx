import { Box } from "@react-three/drei";
import React, { useMemo } from "react";
import * as THREE from "three";

export const Character = ({ color }: { color: string }) => {
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color }),
    [color]
  );

  return (
    <Box castShadow receiveShadow args={[0.5, 2.5, 0.5]} material={material} />
  );
};
