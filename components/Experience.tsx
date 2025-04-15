/**
 * Floor Base by Isa Lousberg
 * Soccer goal by Poly by Google [CC-BY] via Poly Pizza
 * Man by Quaternius
 */

import {
  ContactShadows,
  Environment,
  OrbitControls,
  Sky,
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import React from "react";
import SoccerGoal from "./SoccerGoal";
import Wall from "./Wall";
import SoccerBall from "./SoccerBall";
import useCharactersStore from "@/store/charactersStore";
import SoccerField from "./SoccerField";
import * as THREE from "three";
import { Character } from "./Character";

export const Experience = () => {
  const characters = useCharactersStore((state) => state.characters);

  return (
    <>
      <OrbitControls />
      <Sky sunPosition={[100, 20, 100]} distance={50} />
      <ContactShadows blur={2} />
      <ambientLight intensity={0.3} />
      <Environment preset="sunset" />
      <Physics debug>
        <SoccerField />
        <Wall />
        <SoccerGoal
          position={{ x: 9.55, y: 0, z: 0 }}
          rotation={{ x: 0, y: Math.PI / 2, z: 0 }}
        />
        <SoccerGoal
          position={{ x: -9.55, y: 0, z: 0 }}
          rotation={{ x: 0, y: -Math.PI / 2, z: 0 }}
        />
        {characters.map((character) => (
          <Character
            key={character.id}
            position={
              new THREE.Vector3(
                character.position.x,
                character.position.y,
                character.position.z,
              )
            }
            hairColor={character.hairColor}
            shirtColor={character.shirtColor}
            pantsColor={character.pantsColor}
          />
        ))}
        <SoccerBall />
      </Physics>
    </>
  );
};
