import { Running } from '../../../hooks/useGameContract';
import { useBlockHeader } from '../../../lib/useInk/hooks';

type Props = {
  running: Running;
};

export const RunningStatus: React.FC<Props> = ({ running }) => {
  const categoryClass = 'mr-1';
  const { blockNumber } = useBlockHeader();
  const roundsComplete = blockNumber && blockNumber > running.endBlock;

  return (
    <>
      <h6>
        <span className={categoryClass}>Status:</span>
        <span className="font-normal bg-players-3 text-white rounded-full px-2 py-[2px]">
          {roundsComplete ? 'Complete' : 'Play!'}
        </span>
      </h6>

      <h6 className="my-2">
        <span className={categoryClass}>Round:</span>
        <span className="font-normal bg-brand-500 text-white rounded-full px-2 py-[2px]">
          {`${running.currentRound}/${running.totalRounds}`}
        </span>
      </h6>
    </>
  );
};
