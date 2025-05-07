interface GameConfigType {
  movementSpeed: number;
  ballImpulse: number;
  maxTeamSize: number;
}

export const gameConfig: GameConfigType = {
  movementSpeed: 5,
  ballImpulse: 0.05,
  maxTeamSize: 1,
};
