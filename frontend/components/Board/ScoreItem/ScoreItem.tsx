import { PlayerScore } from '../../../hooks/useGameContract';
import { GiGasPump, GiDatabase, GiCube } from 'react-icons/gi';

export type PlayerScoreUI = {
  player: PlayerScore;
};

type Props = PlayerScoreUI;

export const ScoreItem: React.FC<Props> = ({ player }) => {
  return (
    <div className="flex flex-col">
      <span className="flex items-center justify-between">
        <span className="flex items-center">
          <span className="w-6 h-6 rounded-full border border-brand-500/30" style={{ backgroundColor: player.color }} />
          <h6 className="text-xs font-regular ml-3">{player.name}</h6>
        </span>
        <p className="text-xs text-end">{player.score}</p>
      </span>

      <span className="flex lg:flex-row flex-col lg:items-center items-end justify-end text-end gap-3 text-brand-500/40">
        <span className="flex items-center gap-1">
          <p className="text-[10px]">{player.lastTurn}</p>
          <GiCube size={12} />
        </span>
        <span className="flex items-center gap-1">
          <p className="text-[10px]">{player.gasUsed}</p>
          <GiGasPump size={12} />
        </span>
      </span>
    </div>
  );
};
