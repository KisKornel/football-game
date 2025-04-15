import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Loading from "./Loading";
import {
  KeyboardControls,
  KeyboardControlsEntry,
  Stats,
} from "@react-three/drei";
import { Experience } from "./Experience";

const keyboardMap: KeyboardControlsEntry<string>[] = [
  { name: "shoot", keys: ["KeyK"] },
];

const Game = () => {
  return (
    <>
      <Stats />
      <KeyboardControls map={keyboardMap}>
        <Suspense fallback={<Loading />}>
          <Canvas
            shadows
            camera={{ position: [0, 14, 16], near: 0.1, fov: 40 }}
          >
            <Experience />
          </Canvas>
        </Suspense>
      </KeyboardControls>
    </>
  );
};

export default Game;
