import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Finished, usePlayerScores } from '../../../hooks/useGameContract';
import { truncateHash } from '../../../utils';

type Props = {
  finished: Finished;
};

export const FinishedStatus: React.FC<Props> = ({ finished }) => {
  const categoryClass = 'mr-1';
  const scores = usePlayerScores();
  const { t } = useTranslation('common');

  const winnerName = useMemo(() => {
    const p = scores.find((s) => s.id === finished.winner);
    return p?.name || truncateHash(finished.winner);
  }, [scores, finished.winner]);

  return (
    <>
      <h6 className="my-2">
        <span className={categoryClass}>{t('winner')}:</span>
        <span className="font-normal bg-brand-500 text-white rounded-full px-2 py-[2px]">{winnerName}</span>
      </h6>
    </>
  );
};
