import { Suspense, useState } from "react";
import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { Box, Text } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { Colors } from "@/enums/keyControls";
import { TeamType } from "@/types/types";
import { supabase } from "@/utils/supabase/server";
import useGameStore from "@/store/gameStore";

interface GoalProps extends RigidBodyProps {
  gapWidth: number;
  ballRadius: number;
  wallHeight: number;
  wallThickness: number;
  team: TeamType;
}

const material = new MeshStandardMaterial({ color: Colors.GRAY });

const Goal = ({
  gapWidth,
  ballRadius,
  wallHeight,
  wallThickness,
  team,
  ...props
}: GoalProps) => {
  const scoreBoard = useGameStore((state) => state.scoreBoard);
  const updateBall = useGameStore((state) => state.updateBall);
  const [intersecting, setIntersection] = useState(false);

  const totalWidth = gapWidth + 2 * wallThickness;
  const leftPostX = -totalWidth / 2 + wallThickness / 2;
  const rightPostX = totalWidth / 2 - wallThickness / 2;
  const crossbarY = wallHeight / 2 + wallThickness / 2;

  const handleOnIntersectionEnter = async () => {
    if (scoreBoard) {
      setIntersection(true);

      const goal =
        team === "home"
          ? { home: scoreBoard.home + 1 }
          : { away: scoreBoard.away + 1 };

      const { error } = await supabase
        .from("score_board")
        .update(goal)
        .eq("id", scoreBoard.id)
        .eq("room_id", scoreBoard.room_id);

      if (error) {
        console.error("Socer board update error: ", error);
      }

      updateBall({ position: { x: 0, y: 5, z: 0 } });
    }
  };

  const handleOnIntersectionExit = () => {
    setIntersection(false);
  };

  return (
    <RigidBody type="fixed" {...props}>
      <Box
        scale={[totalWidth, wallThickness, wallThickness]}
        position={[0, crossbarY, 0]}
        material={material}
      />

      <Box
        scale={[wallThickness, wallHeight, wallThickness]}
        position={[leftPostX, 0, 0]}
        material={material}
      />
      <Box
        scale={[wallThickness, wallHeight, wallThickness]}
        position={[rightPostX, 0, 0]}
        material={material}
      />

      <Suspense fallback={null}>
        {intersecting && (
          <Text color={Colors.RED} position={[0, wallHeight, 0]} fontSize={2}>
            Góóól
          </Text>
        )}
      </Suspense>

      <CuboidCollider
        position={[0, 0, wallThickness / 2 + ballRadius - 0.05]}
        args={[gapWidth / 2, wallHeight / 2, wallThickness]}
        sensor
        onIntersectionEnter={handleOnIntersectionEnter}
        onIntersectionExit={handleOnIntersectionExit}
      />
    </RigidBody>
  );
};

export default Goal;
