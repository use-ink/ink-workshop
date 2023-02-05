import { AccountId } from '../../lib/useInk/types';

export type Field = {
  x: string;
  y: string;
};

export type PlayerRegistered = {
  name: EventName.PlayerRegistered;
  player: AccountId;
};

export type RoundIncremented = {
  name: EventName.RoundIncremented;
  roundsPlayed: string;
};

export type SuccessfulTurn = {
  name: 'Success';
  player: string;
  turn: Field;
};

export type OutOfBoundsTurn = {
  name: 'OutOfBounds';
  player: string;
  turn: Field;
};

export type Occupied = {
  name: 'Occupied';
  player: string;
  turn: Field;
};

export type BrokenPlayer = {
  name: 'BrokenPlayer';
  player: string;
};

export type Turn = SuccessfulTurn | OutOfBoundsTurn | Occupied | BrokenPlayer;

export type TurnEvent = Turn & {
  id: string;
};

export type TurnData = {
  [coordinates: string]: TurnEvent[];
};

export enum TurnOutcome {
  Success = 'Success',
  OutOfBounds = 'OutOfBounds',
  Occupied = 'Occupied',
  BrokenPlayer = 'BrokenPlayer',
}

export enum EventName {
  PlayerRegistered = 'PlayerRegistered',
  GameStarted = 'GameStarted',
  TurnTaken = 'TurnTaken',
  GameEnded = 'GameEnded',
  GameDestroyed = 'GameDestroyed',
  RoundIncremented = 'RoundIncremented',
}
