import dynamic from 'next/dynamic';
import React from 'react';

const GameBoard = dynamic(() => import('./GameBoard').then((mod) => mod.GameBoard), {
  ssr: false,
});

export const GamePage: React.FC = () => {
  return (
    <section className="h-screen w-full mx-auto pt-[66px]">
      <GameBoard />
    </section>
  );
};
