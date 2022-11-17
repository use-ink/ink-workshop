import { useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { ContractEvent } from '../lib/useInk/providers/contractEvents/model';

export enum TurnOutcome {
  Success = 'Success',
  OutOfBounds = 'OutOfBounds',
  Occupied = 'Occupied',
  BrokenPlayer = 'BrokenPlayer',
}

export enum EventName {
  TurnTaken = 'TurnTaken',
  GameStarted = 'GameStarted',
  GameDestroyed = 'GameDestroyed',
  GameEnded = 'GameEnded',
}

export const useGameEvents = (eventName?: EventName): ContractEvent[] => {
  const { events } = useGame();
  if (!eventName) return events;

  return useMemo(() => events.filter((e) => e.name === eventName), [events, eventName]);
};

type Field = {
  x: string;
  y: string;
};

type SuccessfulTurn = {
  name: 'Success';
  player: string;
  turn: Field;
};

type OutOfBoundsTurn = {
  name: 'OutOfBounds';
  player: string;
  turn: Field;
};

type Occupied = {
  name: 'Occupied';
  player: string;
  turn: Field;
};

type BrokenPlayer = {
  name: 'BrokenPlayer';
  player: string;
};

export type Turn = SuccessfulTurn | OutOfBoundsTurn | Occupied | BrokenPlayer;

export type TurnEvent = Turn & {
  id: string;
};

export const useTurnTakenEvents = (outcome?: TurnOutcome): TurnEvent[] => {
  const events = useGameEvents(EventName.TurnTaken);
  return useMemo(() => {
    let results: TurnEvent[] = [];

    try {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const outcomeType = Object.keys(event.args[1] as {})[0];
        console.log('outcome type', outcomeType);

        if (outcome && outcomeType !== outcome) continue;

        const base = {
          player: event.args[0] as any as string,
          id: event.id,
        };

        const turn = (Object.values(event.args[1] as {})[0] as { turn?: Field })?.turn || { x: '', y: '' };

        switch (outcomeType) {
          case 'Success':
            results.push({ ...base, name: 'Success', turn });
            break;
          case 'Occupied':
            results.push({ ...base, name: 'Occupied', turn });
            break;
          case 'OutOfBounds':
            results.push({ ...base, name: 'OutOfBounds', turn });
            break;
          case 'BrokenPlayer':
            results.push({ ...base, name: 'BrokenPlayer' });
            break;
        }
      }
    } catch (e) {
      console.error('Error converting useTurnTakenEvents');
    }

    return results;
  }, [events, outcome]);
};

export type TurnData = {
  [coordinates: string]: TurnEvent[];
};

export const useTurnTakenData = (outcome?: TurnOutcome): TurnData => {
  const events = useGameEvents(EventName.TurnTaken);
  return useMemo(() => {
    let results: TurnData = {};

    try {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const outcomeType = Object.keys(event.args[1] as {})[0];
        console.log('outcome type', outcomeType);

        if (outcome && outcomeType !== outcome) continue;

        const base = {
          player: event.args[0] as any as string,
          id: event.id,
        };

        const turn = (Object.values(event.args[1] as {})[0] as { turn?: Field })?.turn || { x: '', y: '' };
        const coordinates = `(${turn.x},${turn.y})`;
        if (!results[coordinates]) results[coordinates] = [];

        switch (outcomeType) {
          case 'Success':
            results[coordinates].push({ ...base, name: 'Success', turn });
            break;
          case 'Occupied':
            results[coordinates].push({ ...base, name: 'Occupied', turn });
            break;
          case 'OutOfBounds':
            results[coordinates].push({ ...base, name: 'OutOfBounds', turn });
            break;
          case 'BrokenPlayer':
            results[coordinates].push({ ...base, name: 'BrokenPlayer' });
            break;
        }
      }
    } catch (e) {
      console.error('Error converting useTurnTakenEvents');
    }

    return results;
  }, [events, outcome]);
};
