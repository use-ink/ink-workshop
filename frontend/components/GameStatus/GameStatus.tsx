import { GiCube } from 'react-icons/gi';
import { useGameState } from '../../hooks/useGameContract';
import { useBlockHeader } from '../../lib/useInk/hooks';
import { SimpleWidget } from '../SimpleWidget';
import { FinishedStatus } from './FinishedStatus';
import { FormingStatus } from './FormingStatus';
import { RunningStatus } from './RunningStatus';

type RunningStatus = {
  status: 'Running';
  totalRounds: number;
  currentRound: number;
  willStart: boolean;
  isActive: boolean;
  hasEnded: boolean;
  startingIn: number;
};

export const GameStatus: React.FC = () => {
  const gameState = useGameState();
  const { blockNumber } = useBlockHeader();

  return (
    <SimpleWidget>
      {'Forming' === gameState?.status && <FormingStatus forming={gameState} />}
      {'Running' === gameState?.status && <RunningStatus running={gameState} />}
      {'Finished' === gameState?.status && <FinishedStatus finished={gameState} />}

      <span className="flex items-center">
        <span className="mr-1">
          <GiCube size={12} />
        </span>
        <h6 className="font-normal rounded-full">{blockNumber}</h6>
      </span>
    </SimpleWidget>
  );
};
