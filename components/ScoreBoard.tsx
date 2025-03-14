import { Billboard, Text } from "@react-three/drei";
import React from "react";

const ScoreBoard = () => {
  return (
    <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
      <Text fontSize={1}>I am a billboard</Text>
    </Billboard>
  );
};

export default ScoreBoard;
