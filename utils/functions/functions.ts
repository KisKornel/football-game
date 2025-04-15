import * as THREE from "three";

export const generateRandomId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomPart}`;
};

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

export const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const calculateImpulse = (
  ballPosition: THREE.Vector3,
  playerPosition: THREE.Vector3,
  impulseMagnitude: number,
): THREE.Vector3 => {
  const direction = new THREE.Vector3().subVectors(
    ballPosition,
    playerPosition,
  );

  direction.normalize();

  direction.multiplyScalar(impulseMagnitude);

  return direction;
};
