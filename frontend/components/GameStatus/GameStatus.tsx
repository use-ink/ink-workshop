import { GiBackup } from 'react-icons/gi';
import { useGameState, usePlayers } from '../../hooks/useGameContract';
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
  const players = usePlayers();

  return (
    <SimpleWidget>
      {'Forming' === gameState?.status && <FormingStatus />}
      {'Running' === gameState?.status && <RunningStatus />}
      {'Finished' === gameState?.status && <FinishedStatus finished={gameState} />}

      <span className="flex items-center justify-between mt-2">
        <span className="mr-1">
          <GiBackup size={18} />
        </span>
        <h6 className="font-normal rounded-full text-md">{Object.keys(players).length}</h6>
      </span>
    </SimpleWidget>
  );
};
