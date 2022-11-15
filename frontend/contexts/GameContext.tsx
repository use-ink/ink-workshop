import { ContractPromise } from '@polkadot/api-contract';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import METADATA from '../constants/game/metadata.json';
import { useContract } from '../lib/useInk/hooks';

type Game = {
  gameAddress: string | undefined;
  setGameAddress: (add: string | undefined) => void;
  game: ContractPromise | undefined;
};

const DEFAULT_GAME: Game = {
  setGameAddress: (_: string | undefined) => null,
  gameAddress: undefined,
  game: undefined,
};

const useGameValues = (): Game => {
  const [gameAddress, setGameAddress] = useState<string | undefined>();
  const game = useContract(gameAddress || '', METADATA);

  return {
    gameAddress,
    setGameAddress,
    game,
  };
};

export const GameContext = createContext<Game>(DEFAULT_GAME);

export const useGame = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useGameValues();
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
