export interface RoomType {
  id: string;
  name: string;
  is_available: boolean;
}

export type TeamType = "home" | "away" | "no";

export interface PlayerType {
  id: string;
  username: string;
  team: TeamType;
  position: { x: number; y: number; z: number };
  rotation: number;
  color: string;
  online: boolean;
  room_id: string;
  ready: boolean;
}

export interface BallType {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  angularVelocity: { x: number; y: number; z: number };
  color: string;
  controlledBy: string;
}

export interface State {
  rooms: { [id: string]: RoomType };
  localPlayer: PlayerType | null;
  players: { [id: string]: PlayerType };
  ball: BallType;
}

export interface Actions {
  setLocalPlayer: (newPlayer: PlayerType | null) => void;
  updateLocalPlayer: (updateData: Omit<Partial<PlayerType>, "id">) => void;
  addRoom: (id: string, newRoom: RoomType) => void;
  updateRoom: (id: string, updateData: Partial<RoomType>) => void;
  addPlayer: (id: string, newPlayer: PlayerType) => void;
  updatePlayer: (id: string, updatePlayer: Partial<PlayerType>) => void;
  deletePlayer: (id: string) => void;
  updateBall: (updateBall: Partial<BallType>) => void;
}
