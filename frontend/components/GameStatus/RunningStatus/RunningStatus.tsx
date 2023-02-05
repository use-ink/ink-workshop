import { useTranslation } from 'react-i18next';
import { useContractCallDecoded } from '../../../lib/useInk/hooks/useContractCallDecoded';
import { Running } from '../../../hooks/useGameContract';
import { useGame } from '../../../contexts/GameContext';
import { useEffect, useState } from 'react';

type Props = {
  running: Running;
};

export const RunningStatus: React.FC<Props> = ({ running }) => {
  const categoryClass = 'mr-1';
  const { t } = useTranslation('common');
  const { game, roundsPlayed } = useGame();
  const decoded = useContractCallDecoded<boolean>(game, 'isRunning');
  const isRunning = decoded && decoded.ok ? decoded.value.result : false;
  const [latestRound, setLatestRound] = useState(running.currentRound);

  // useContractCallDecoded() reads the contract on every block change via a subscription,
  // but events can be emitted prior to this. In order to keep the painted pixel changes,
  // which are driven by events, and the block number changes in sync
  // we first check to see if roundsPlayed has been updated from an event, then resort to
  // the value fetched from useContracCallDecoded() if it hasn't (used on page load).
  useEffect(() => {
    if (running.currentRound > latestRound) setLatestRound(running.currentRound);
    if (roundsPlayed > latestRound) setLatestRound(roundsPlayed);
  }, [running.currentRound, roundsPlayed]);

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
          {`${latestRound}/${running.totalRounds}`}
        </span>
      </h6>
    </>
  );
};
