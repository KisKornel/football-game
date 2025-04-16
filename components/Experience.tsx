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
import { CharacterController } from "./CharacterController";

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
          team="home"
          position={{ x: 9.55, y: 0, z: 0 }}
          rotation={{ x: 0, y: Math.PI / 2, z: 0 }}
        />
        <SoccerGoal
          team="away"
          position={{ x: -9.55, y: 0, z: 0 }}
          rotation={{ x: 0, y: -Math.PI / 2, z: 0 }}
        />
        {characters.map((character) => (
          <CharacterController key={character.id} character={character} />
        ))}
        <SoccerBall />
      </Physics>
    </>
  );
};
