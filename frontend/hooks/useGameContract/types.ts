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
  hasEnded: boolean;
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
  gasUsed: number;
};

export type PlayerList = { [accountId: string]: string };

export type Color = string;
export type PlayerColors = {
  [id: AccountId]: Color;
};

export type Score = string;
export type PlayerScoreData = [Player, Score];

export type PlayerScore = Player & {
  score: Score;
  color: Color;
};

export type XYCoordinate = [number, number];

export type BoardPositionRaw = null | [XYCoordinate, AccountId | null | undefined];
export type BoardPosition = {
  x: number;
  y: number;
  owner?: AccountId | null;
  color?: Color;
};
