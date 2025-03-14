import { Suspense, useState } from "react";
import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { Box, Text } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { Colors } from "@/enums/keyControls";

const material = new MeshStandardMaterial({ color: Colors.GRAY });

const Goal = ({ ...props }: RigidBodyProps) => {
  const [intersecting, setIntersection] = useState(false);

  const handleOnIntersectionEnter = () => {
    setIntersection(true);
  };

  const handleOnIntersectionExit = () => {
    setIntersection(false);
  };

  return (
    <RigidBody type="fixed" {...props}>
      <Box scale={[11, 1, 1]} position={[0, 3, 0]} material={material} />
      <Box scale={[1, 6, 1]} position={[-5, 0, 0]} material={material} />
      <Box scale={[1, 6, 1]} position={[5, 0, 0]} material={material} />

      <Box scale={[1, 1, 3]} position={[-5, -3, 0]} material={material} />
      <Box scale={[1, 1, 3]} position={[5, -3, 0]} material={material} />

      <Suspense fallback={null}>
        {intersecting && (
          <Text color={Colors.RED} position={[0, 5, 0]} fontSize={2}>
            Goal
          </Text>
        )}
      </Suspense>

      <CuboidCollider
        position={[0, -0.5, -0.5]}
        args={[5, 3, 1]}
        sensor
        onIntersectionEnter={handleOnIntersectionEnter}
        onIntersectionExit={handleOnIntersectionExit}
      />
    </RigidBody>
  );
};

export default Goal;
