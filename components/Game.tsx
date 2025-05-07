import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Loading from "./Loading";
import { Stats } from "@react-three/drei";
import { Experience } from "./Experience";

const Game = () => {
  return (
    <>
      <Stats />
      <Suspense fallback={<Loading />}>
        <Canvas shadows camera={{ position: [0, 14, 16], near: 0.1, fov: 40 }}>
          <Experience />
        </Canvas>
      </Suspense>
    </>
  );
};

export default Game;
