/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

"use client";

import * as THREE from "three";
import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";
import { useFrame, useGraph } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    BaseHuman_1: THREE.SkinnedMesh;
    BaseHuman_2: THREE.SkinnedMesh;
    BaseHuman_3: THREE.SkinnedMesh;
    BaseHuman_4: THREE.SkinnedMesh;
    BaseHuman_5: THREE.SkinnedMesh;
    BaseHuman_6: THREE.SkinnedMesh;
    Bone: THREE.Bone;
  };
  materials: {
    Shirt: THREE.MeshStandardMaterial;
    Skin: THREE.MeshStandardMaterial;
    Pants: THREE.MeshStandardMaterial;
    Eyes: THREE.MeshStandardMaterial;
    Socks: THREE.MeshStandardMaterial;
    Hair: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | "HumanArmature|Man_Clapping"
  | "HumanArmature|Man_Death"
  | "HumanArmature|Man_Idle"
  | "HumanArmature|Man_Jump"
  | "HumanArmature|Man_Punch"
  | "HumanArmature|Man_Run"
  | "HumanArmature|Man_RunningJump"
  | "HumanArmature|Man_Sitting"
  | "HumanArmature|Man_Standing"
  | "HumanArmature|Man_SwordSlash"
  | "HumanArmature|Man_Walk";

interface AnimatedManProps {
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
}

const MOVEMENT_SPEED = 0.032;

export function AnimatedMan({
  hairColor = "green",
  shirtColor = "pink",
  pantsColor = "brown",
  ...props
}: AnimatedManProps & JSX.IntrinsicElements["group"]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const position = useMemo(() => props.position, []);
  const group = useRef<THREE.Group | null>(null);

  const { scene, materials, animations } = useGLTF(
    "/models/Man.glb",
  ) as GLTFResult & { animations: THREE.AnimationClip[] };

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  const [animation, setAnimation] = useState<ActionName>(
    "HumanArmature|Man_Idle",
  );

  useEffect(() => {
    if (!actions) return;

    actions[animation]?.reset().fadeIn(0.032).play();
    return () => {
      actions[animation]?.fadeOut(0.032);
    };
  }, [actions, animation]);

  useFrame(() => {
    if (
      group.current &&
      props.position &&
      group.current.position.distanceTo(props.position as THREE.Vector3) > 0.1
    ) {
      const direction = group.current.position
        .clone()
        .sub(props.position as THREE.Vector3)
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED);
      group.current.position.sub(direction);
      group.current.lookAt(props.position as THREE.Vector3);
      setAnimation("HumanArmature|Man_Run");
    } else {
      setAnimation("HumanArmature|Man_Idle");
    }
  });

  return (
    <group ref={group} {...props} position={position} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="HumanArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={30}
          >
            <primitive object={nodes.Bone} />
          </group>
          <group name="BaseHuman" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="BaseHuman_1"
              geometry={nodes.BaseHuman_1.geometry}
              material={materials.Shirt}
              skeleton={nodes.BaseHuman_1.skeleton}
            >
              <meshStandardMaterial color={shirtColor} />
            </skinnedMesh>
            <skinnedMesh
              name="BaseHuman_2"
              geometry={nodes.BaseHuman_2.geometry}
              material={materials.Skin}
              skeleton={nodes.BaseHuman_2.skeleton}
            />
            <skinnedMesh
              name="BaseHuman_3"
              geometry={nodes.BaseHuman_3.geometry}
              material={materials.Pants}
              skeleton={nodes.BaseHuman_3.skeleton}
            >
              <meshStandardMaterial color={pantsColor} />
            </skinnedMesh>
            <skinnedMesh
              name="BaseHuman_4"
              geometry={nodes.BaseHuman_4.geometry}
              material={materials.Eyes}
              skeleton={nodes.BaseHuman_4.skeleton}
            />
            <skinnedMesh
              name="BaseHuman_5"
              geometry={nodes.BaseHuman_5.geometry}
              material={materials.Socks}
              skeleton={nodes.BaseHuman_5.skeleton}
            />
            <skinnedMesh
              name="BaseHuman_6"
              geometry={nodes.BaseHuman_6.geometry}
              material={materials.Hair}
              skeleton={nodes.BaseHuman_6.skeleton}
            >
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Man.glb");
