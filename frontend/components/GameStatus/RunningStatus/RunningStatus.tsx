import { Running } from '../../../hooks/useGameContract';
import { useInk } from '../../../lib/useInk';

type Props = {
  running: Running;
};

export const RunningStatus: React.FC<Props> = ({ running }) => {
  const categoryClass = 'mr-1';
  const { header } = useInk();
  const currentBlock = header?.number?.toNumber() || 0;

  return (
    <>
      <h6>
        <span className={categoryClass}>Status:</span>
        <span className="font-normal bg-players-3 text-white rounded-full px-2 py-[2px]">Play!</span>
      </h6>

      <h6 className="my-2">
        <span className={categoryClass}>Round:</span>
        <span className="font-normal bg-brand-500 text-white rounded-full px-2 py-[2px]">
          {currentBlock > running.endBlock ? 'OVER' : `${running.currentRound}/${running.totalRounds}`}
        </span>
      </h6>
    </>
  );
};
