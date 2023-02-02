export type AccountId = string;

export type Field = { x: string; y: string };

export type Dimensions = {
  x: number;
  y: number;
};

export type Forming = {
  status: 'Forming';
  earliestStart: number;
  startingIn: number;
};

export type Running = {
  status: 'Running';
  totalRounds: number;
  currentRound: number;
};

export type Finished = {
  status: 'Finished';
  winner: AccountId;
};

export type GameStatus = 'Forming' | 'Running' | 'Finished';

export type GameState = Forming | Running | Finished;

export type Player = {
  id: AccountId;
  name: string;
  gasUsed: string;
  score: number;
};

export type PlayerList = { [accountId: string]: string };

export type Color = string;
export type PlayerColors = {
  [id: AccountId]: Color;
};

export type Score = string;

export type PlayerScore = Player & {
  color: Color;
  gasLeft: string;
};

export type XYCoordinate = [number, number];

export type BoardPositionRaw = null | [XYCoordinate, AccountId | null | undefined];
export type BoardPosition = {
  x: number;
  y: number;
  owner?: AccountId | null;
  color?: Color;
};
