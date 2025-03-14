import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import { Box } from "@react-three/drei";
import * as THREE from "three";

interface GroundProps {
  floorSize: number;
  floorThickness: number;
  wallHeight: number;
  wallThickness: number;
  wallColor: string;
  floorColor: string;
}

const GroundWithGoals = ({
  floorSize,
  floorThickness,
  wallHeight,
  wallThickness,
  wallColor,
  floorColor,
}: GroundProps) => {
  const wallY = -1 + wallHeight / 2;
  const frontZ = -floorSize / 2 - wallThickness / 2;
  const backZ = floorSize / 2 + wallThickness / 2;
  const gapWidth = 11;
  const segmentWidth = (floorSize - gapWidth) / 2;

  const floor = useMemo(
    () => new THREE.MeshStandardMaterial({ color: floorColor }),
    [floorColor]
  );

  const wall = useMemo(
    () => new THREE.MeshStandardMaterial({ color: wallColor }),
    [wallColor]
  );

  return (
    <RigidBody type="fixed">
      <Box
        args={[floorSize, floorThickness, floorSize]}
        position={[0, -1 - floorThickness / 2, 0]}
        material={floor}
        castShadow
        receiveShadow
      />

      <Box
        args={[wallThickness, wallHeight, floorSize]}
        position={[-floorSize / 2 - wallThickness / 2, wallY, 0]}
        material={wall}
      />

      <Box
        args={[wallThickness, wallHeight, floorSize]}
        position={[floorSize / 2 + wallThickness / 2, wallY, 0]}
        material={wall}
      />

      <Box
        args={[segmentWidth, wallHeight, wallThickness]}
        position={[-(floorSize / 2 - segmentWidth / 2), wallY, frontZ]}
        material={wall}
      />
      <Box
        args={[segmentWidth, wallHeight, wallThickness]}
        position={[floorSize / 2 - segmentWidth / 2, wallY, frontZ]}
        material={wall}
      />

      <Box
        args={[segmentWidth, wallHeight, wallThickness]}
        position={[-(floorSize / 2 - segmentWidth / 2), wallY, backZ]}
        material={wall}
      />
      <Box
        args={[segmentWidth, wallHeight, wallThickness]}
        position={[floorSize / 2 - segmentWidth / 2, wallY, backZ]}
        material={wall}
      />
    </RigidBody>
  );
};

export default GroundWithGoals;
