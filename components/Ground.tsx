/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

interface GroundProps {
  floorSize: number;
  floorThickness: number;
  wallHeight: number;
  wallThickness: number;
  wallColor: string;
  floorColor: string;
  gapWidth: number;
}

const GroundWithHexagonGoals = ({
  floorSize,
  floorThickness,
  wallHeight,
  wallThickness,
  wallColor,
  floorColor,
  gapWidth,
}: GroundProps) => {
  const r = floorSize / 2;

  const v0 = useMemo(() => {
    return { x: floorSize / (2 * Math.sqrt(3)), z: r };
  }, []);
  const v1 = useMemo(() => {
    return { x: -floorSize / (2 * Math.sqrt(3)), z: r };
  }, []);
  const v2 = useMemo(() => {
    return { x: -floorSize / Math.sqrt(3), z: 0 };
  }, []);
  const v3 = useMemo(() => {
    return { x: -floorSize / (2 * Math.sqrt(3)), z: -r };
  }, []);
  const v4 = useMemo(() => {
    return { x: floorSize / (2 * Math.sqrt(3)), z: -r };
  }, []);
  const v5 = useMemo(() => {
    return { x: floorSize / Math.sqrt(3), z: 0 };
  }, []);

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(v0.x, v0.z);
    shape.lineTo(v1.x, v1.z);
    shape.lineTo(v2.x, v2.z);
    shape.lineTo(v3.x, v3.z);
    shape.lineTo(v4.x, v4.z);
    shape.lineTo(v5.x, v5.z);
    shape.lineTo(v0.x, v0.z);
    return shape;
  }, [v0, v1, v2, v3, v4, v5]);

  const floorMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: floorColor }),
    [floorColor]
  );
  const wallMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: wallColor }),
    [wallColor]
  );

  const edges = [
    { start: v0, end: v1, isGoal: true },
    { start: v1, end: v2, isGoal: false },
    { start: v2, end: v3, isGoal: false },
    { start: v3, end: v4, isGoal: true },
    { start: v4, end: v5, isGoal: false },
    { start: v5, end: v0, isGoal: false },
  ];

  const wallSegments = edges.map((edge) => {
    const dx = edge.end.x - edge.start.x;
    const dz = edge.end.z - edge.start.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const mid = {
      x: (edge.start.x + edge.end.x) / 2,
      z: (edge.start.z + edge.end.z) / 2,
    };
    const angle = Math.atan2(dz, dx);
    return { ...edge, length, mid, angle };
  });

  return (
    <>
      <RigidBody type="fixed">
        <mesh
          geometry={
            new THREE.ExtrudeGeometry(hexShape, {
              depth: floorThickness,
              bevelEnabled: false,
            })
          }
          material={floorMaterial}
          position={[0, -1, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          receiveShadow
        />
      </RigidBody>

      <RigidBody type="fixed">
        {wallSegments.map((seg, index) => {
          if (!seg.isGoal) {
            return (
              <mesh
                key={index}
                material={wallMaterial}
                position={[seg.mid.x, -1 + wallHeight / 2, seg.mid.z]}
                rotation={[0, -seg.angle, 0]}
              >
                <boxGeometry args={[seg.length, wallHeight, wallThickness]} />
              </mesh>
            );
          } else {
            const segLength = seg.length;
            const segmentLength =
              (segLength - gapWidth - wallThickness * 2) / 2;

            const nx = Math.cos(seg.angle);
            const nz = Math.sin(seg.angle);

            const leftCenter = {
              x: seg.start.x + nx * (segmentLength / 2),
              z: seg.start.z + nz * (segmentLength / 2),
            };

            const rightCenter = {
              x: seg.end.x - nx * (segmentLength / 2),
              z: seg.end.z - nz * (segmentLength / 2),
            };
            return (
              <group key={index}>
                <mesh
                  material={wallMaterial}
                  position={[leftCenter.x, -1 + wallHeight / 2, leftCenter.z]}
                  rotation={[0, -seg.angle, 0]}
                >
                  <boxGeometry
                    args={[segmentLength, wallHeight, wallThickness]}
                  />
                </mesh>
                <mesh
                  material={wallMaterial}
                  position={[rightCenter.x, -1 + wallHeight / 2, rightCenter.z]}
                  rotation={[0, -seg.angle, 0]}
                >
                  <boxGeometry
                    args={[segmentLength, wallHeight, wallThickness]}
                  />
                </mesh>
              </group>
            );
          }
        })}
      </RigidBody>
    </>
  );
};

export default GroundWithHexagonGoals;
