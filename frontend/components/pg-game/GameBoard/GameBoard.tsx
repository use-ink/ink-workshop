import React from 'react';
import { useDimensions, useBoard, usePlayerScores } from '../../../hooks/useGameContract';
import { Board } from '../../Board';

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

  return <Board board={board} dimensions={dim} scores={scores} className="w-full h-full" />;
};
