export interface RoomType {
  id: string;
  name: string;
  available: boolean;
  createdAt: string;
}

export type TeamType = "home" | "away" | "no";
export type PositionType = { x: number; y: number; z: number };

export interface CharacterType {
  id: string;
  username: string;
  color: string;
  position: PositionType;
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
  id: string;
  home: number;
  away: number;
}
