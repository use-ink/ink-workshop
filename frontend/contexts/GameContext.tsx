import { Abi, ContractPromise } from '@polkadot/api-contract';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import METADATA from '../constants/game/metadata.json';
import { useContract } from '../lib/useInk/hooks';
import { useContractEvents } from '../lib/useInk/hooks/useContractEvents';
import { ContractEvent } from '../lib/useInk/providers/contractEvents/model';

const ABI = new Abi(METADATA);

type Game = {
  gameAddress: string | undefined;
  setGameAddress: (add: string | undefined) => void;
  game: ContractPromise | undefined;
  events: ContractEvent[];
};

const DEFAULT_GAME: Game = {
  setGameAddress: (_: string | undefined) => null,
  gameAddress: undefined,
  game: undefined,
  events: [],
};

const useGameValues = (): Game => {
  const [gameAddress, setGameAddress] = useState<string | undefined>();
  const game = useContract(gameAddress || '', METADATA);
  const events = useContractEvents(gameAddress || '', ABI);

  return {
    gameAddress,
    setGameAddress,
    game,
    events,
  };
};

export const GameContext = createContext<Game>(DEFAULT_GAME);

export const useGame = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useGameValues();
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
