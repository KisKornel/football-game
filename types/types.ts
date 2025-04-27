export interface RoomType {
  id: string;
  name: string;
  available: boolean;
  createdAt: string;
}

export type TeamType = "home" | "away" | "no";
export type Vec3 = { x: number; y: number; z: number };
export type Quat = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export interface CharacterType {
  id: string;
  username: string;
  position: Vec3;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  roomId: string;
  team: TeamType;
  online: boolean;
  ready: boolean;
  host: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreBoardType {
  home: number;
  away: number;
}

export interface BallType {
  position: Vec3;
  velocity: Vec3;
  rotation: Quat;
}
