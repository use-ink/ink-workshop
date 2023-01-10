import { useTranslation } from 'react-i18next';
import { Running } from '../../../hooks/useGameContract';
import { useBlockHeader } from '../../../lib/useInk/hooks';

type Props = {
  running: Running;
};

export const RunningStatus: React.FC<Props> = ({ running }) => {
  const categoryClass = 'mr-1';
  const { blockNumber } = useBlockHeader();
  const roundsComplete = blockNumber && blockNumber > running.endBlock;
  const { t } = useTranslation('common');

  return (
    <>
      <h6>
        <span className={categoryClass}>{t('status')}:</span>
        <span className="font-normal bg-players-3 text-white rounded-full px-2 py-[2px]">
          {roundsComplete ? t('complete') : t('play')}
        </span>
      </h6>

      <h6 className="my-2">
        <span className={categoryClass}>{t('block')}:</span>
        <span className="font-normal bg-brand-500 text-white rounded-full px-2 py-[2px]">
          {`${running.currentRound}/${running.totalRounds}`}
        </span>
      </h6>
    </>
  );
};
