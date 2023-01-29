import { useTranslation } from 'react-i18next';
import { useGame } from '../../../contexts/GameContext';
import { Running } from '../../../hooks/useGameContract';
import { useContractCallDecoded } from '../../../lib/useInk/hooks/useContractCallDecoded';

type Props = {
  running: Running;
};

export const RunningStatus: React.FC<Props> = ({ running }) => {
  const categoryClass = 'mr-1';
  const { t } = useTranslation('common');
  const useGameContract = () => useGame().game;
  const game = useGameContract();
  const decoded = useContractCallDecoded<boolean>(game, 'isRunning');
  const isRunning = decoded && decoded.ok ? decoded.value.result : false;

  return (
    <>
      <h6>
        <span className={categoryClass}>{t('status')}:</span>
        <span className="font-normal bg-players-3 text-white rounded-full px-2 py-[2px]">
          {isRunning ? t('play') : t('complete')}
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
