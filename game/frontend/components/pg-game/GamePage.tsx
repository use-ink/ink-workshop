import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { GameBoard } from './GameBoard';

export const GamePage: React.FC = () => {
  const { address } = useRouter().query;
  const { setGameAddress } = useGame();

  useEffect(() => {
    setGameAddress((address as string) || undefined);
  }, [address, setGameAddress]);

  return (
    <section className="h-screen w-full mx-auto pt-[40px]">
      <GameBoard />
    </section>
  );
};
