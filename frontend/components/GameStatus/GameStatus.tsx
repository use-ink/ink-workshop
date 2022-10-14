import { GiCube } from 'react-icons/gi';
import { useGameState } from '../../hooks/useGameContract';
import { useInk } from '../../lib/useInk';
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

type Status = RunningStatus;

export const GameStatus: React.FC = () => {
  const gameState = useGameState();
  const { header } = useInk();

  return (
    <SimpleWidget>
      {'Forming' === gameState?.status && <FormingStatus forming={gameState} />}
      {'Running' === gameState?.status && <RunningStatus running={gameState} />}
      {'Finished' === gameState?.status && <FinishedStatus finished={gameState} />}

      <span className="flex items-center">
        <span className="mr-1">
          <GiCube size={12} />
        </span>
        <h6 className="font-normal rounded-full">{header?.number?.toHuman()?.toString()}</h6>
      </span>
    </SimpleWidget>
  );
};
