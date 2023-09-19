import { PlayerScore } from '../../../hooks/useGameContract';
import { GiGasPump, GiCube } from 'react-icons/gi';

export type PlayerScoreUI = {
  player: PlayerScore;
  rank: number;
};

type Props = PlayerScoreUI;

export const ScoreItem: React.FC<Props> = ({ player, rank }) => {
  return (
    <div className="flex flex-col">
      <span className="flex items-center justify-between">
        <span className="flex items-center">
          <h5 className="font-bold text-md">{rank ? `#${rank}` : '--'}</h5>
          <h6 className="text-xs font-regular ml-2">{player.name}</h6>
        </span>

        <span className="flex items-center">
          <p className="text-xs text-end">{player.score}</p>
          <img src="/star-fish.svg" className="w-4 ml-1" />
        </span>
      </span>

      <span className="flex lg:flex-row flex-col lg:items-center items-end justify-end text-end gap-3 text-brand-500/40">
        <span className="flex items-center gap-1">
          <p className="text-[10px]">{player.gasLeft}</p>
          <GiGasPump size={12} />
        </span>
      </span>
    </div>
  );
};
