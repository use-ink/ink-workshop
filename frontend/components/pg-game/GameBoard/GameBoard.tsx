import dynamic from 'next/dynamic';
import React from 'react';
import { useDimensions, useBoard, usePlayerScores } from '../../../hooks/useGameContract';
import { Board } from '../../Board';
import { ConnectWallet } from '../../ConnectWallet';

// const ConnectWallet = dynamic(() => import('../../ConnectWallet').then((mod) => mod.ConnectWallet), {
//   ssr: false,
// });

export const GameBoard: React.FC = () => {
  const dim = useDimensions();
  const board = useBoard();
  const scores = usePlayerScores();

  if (!dim) {
    return (
      <div className="flex items-center justify-center flex-col h-full">
        <h1 className="text-xl">Contract Not Found</h1>
        <p className="text-md max-w-sm text-center">
          Make sure the chain is running and the contract address is correct.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-3 bottom-3 max-w-sm">
        <ConnectWallet />
      </div>
      <Board boardWidth="75%" board={board} dimensions={dim} scores={scores} className="w-full h-full" />
    </>
  );
};
