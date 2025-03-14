import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Loading from "./Loading";
import {
  CameraControls,
  Environment,
  KeyboardControls,
  KeyboardControlsEntry,
  OrthographicCamera,
  Sky,
  Stats,
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ground from "./Ground";
//import BallController from "./BallController";
import Goal from "./Goal";
import { Colors, Controls } from "@/enums/keyControls";
import { CharacterController } from "./CharacterController";
import * as THREE from "three";
import useGameStore from "@/store/gameStore";

THREE.ColorManagement.enabled = true;

const SET_INTERVAL = 0.1;

const FLOOR_SIZE = 50;
const FLOOR_THICKNESS = 1;
const WALL_HEIGHT = 3;
const WALL_THICKNESS = 1;
const WALL_COLOR = Colors.ORANGE;
const FLOOR_COLOR = Colors.GREEN;
const ROTATION_SPEED = 0.5;
const WALK_SPEED = 4;

const keyboardMap: KeyboardControlsEntry<string>[] = [
  { name: Controls.FORWARD, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.BACKWARD, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.LEFT, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.RIGHT, keys: ["ArrowRight", "KeyD"] },
  { name: Controls.KICK, keys: ["KeyK"] },
];

const ThreeScene = () => {
  const players = useGameStore((state) => state.players);
  const localPlayer = useGameStore((state) => state.localPlayer);

  return (
    <KeyboardControls map={keyboardMap}>
      <Suspense fallback={<Loading />}>
        <Canvas shadows camera={{ position: [24, 24, 24], near: 0.1, fov: 40 }}>
          <Sky sunPosition={[100, 20, 100]} distance={FLOOR_SIZE * 3} />
          <Environment preset="sunset" />
          <directionalLight
            intensity={0.65}
            castShadow
            position={[-15, 10, 15]}
          >
            <OrthographicCamera left={-22} right={15} top={10} bottom={-20} />
          </directionalLight>
          <ambientLight intensity={0.3} />
          <Physics debug>
            <Ground
              floorSize={FLOOR_SIZE}
              floorThickness={FLOOR_THICKNESS}
              wallHeight={WALL_HEIGHT}
              wallThickness={WALL_THICKNESS}
              floorColor={FLOOR_COLOR}
              wallColor={WALL_COLOR}
            />

            <Goal position={[0, 2.5, -FLOOR_SIZE / 2 - WALL_THICKNESS / 2]} />
            <Goal
              position={[0, 2.5, FLOOR_SIZE / 2 + WALL_THICKNESS / 2]}
              rotation={[0, Math.PI, 0]}
            />

            {/*
            <BallController
              setInterval={SET_INTERVAL}
              localPlayerId={localPlayer.id}
            />
            */}

            {Object.keys(players).length > 0 &&
              Object.entries(players).map(([id, player]) => (
                <CharacterController
                  key={id}
                  isLocal={id === localPlayer?.id}
                  setInterval={SET_INTERVAL}
                  player={player}
                  rotationSpeed={ROTATION_SPEED}
                  walkSpeed={WALK_SPEED}
                />
              ))}
          </Physics>

          <CameraControls />
          <Stats />
        </Canvas>
      </Suspense>
    </KeyboardControls>
  );
};

export default ThreeScene;
