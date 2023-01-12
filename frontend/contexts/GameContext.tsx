import { Abi, ContractPromise } from '@polkadot/api-contract';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import METADATA from '../constants/game/metadata.json';
import { EventName, Field, TurnData, TurnEvent } from '../hooks/useGameEvents';
import { useContract } from '../lib/useInk/hooks';
import { useContractEvents } from '../lib/useInk/hooks/useContractEvents';
import { ContractEvent } from '../lib/useInk/providers/contractEvents/model';

export const ABI = new Abi(METADATA);

type Game = {
  gameAddress: string | undefined;
  setGameAddress: (add: string | undefined) => void;
  game: ContractPromise | undefined;
  events: ContractEvent[];
  turnData: TurnData;
  playerTurnEvents: TurnEvent[];
};

const DEFAULT_GAME: Game = {
  setGameAddress: (_: string | undefined) => null,
  gameAddress: undefined,
  game: undefined,
  events: [],
  turnData: {},
  playerTurnEvents: [],
};

const useGameValues = (): Game => {
  const [gameAddress, setGameAddress] = useState<string | undefined>();
  const game = useContract(gameAddress || '', METADATA);
  const events = useContractEvents(gameAddress || '', ABI, true);

  const [turnData, playerTurnEvents] = useMemo(() => {
    const results: TurnData = {};
    const playerTurns: TurnEvent[] = [];

    try {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (EventName.TurnTaken !== event.name) continue;

        const eventPlayer = event.args[0] as any as string;

        const base = { player: eventPlayer, id: event.id };
        const turn = (Object.values(event.args[1] as object)[0] as { turn?: Field })?.turn || { x: '', y: '' };
        const coordinates = `(${turn.x},${turn.y})`;

        if (!results[coordinates]) results[coordinates] = [];

        const outcomeType = Object.keys(event.args[1] as object)[0];
        if ('Success' === outcomeType) {
          const successEvent: TurnEvent = { ...base, name: 'Success', turn };
          playerTurns.push(successEvent);
          results[coordinates].push(successEvent);
        }

        if ('Occupied' === outcomeType) {
          const occupiedEvent: TurnEvent = { ...base, name: 'Occupied', turn };
          playerTurns.push(occupiedEvent);
          results[coordinates].push(occupiedEvent);
        }

        if ('OutOfBounds' === outcomeType) {
          const outOfBoundesEvent: TurnEvent = { ...base, name: 'OutOfBounds', turn };
          playerTurns.push(outOfBoundesEvent);
          results[coordinates].push(outOfBoundesEvent);
        }

        if ('BrokenPlayer' === outcomeType) {
          const brokenPlayerEvent: TurnEvent = { ...base, name: 'BrokenPlayer' };
          playerTurns.push(brokenPlayerEvent);
          results[coordinates].push();
        }
      }
    } catch (e) {
      console.error('Error converting useTurnTakenEvents');
    }

    return [results, playerTurns];
  }, [events]);

  return {
    gameAddress,
    setGameAddress,
    game,
    events,
    turnData,
    playerTurnEvents,
  };
};

export const GameContext = createContext<Game>(DEFAULT_GAME);

export const useGame = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useGameValues();
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
