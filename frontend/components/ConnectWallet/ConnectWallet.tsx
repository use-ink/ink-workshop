import { useUI } from '../../contexts/UIContext';
import { Button } from '../Button';
import classNames from 'classnames';
import { truncateHash } from '../../utils';
import { GiScrollUnfurled, GiWallet } from 'react-icons/gi';
import { RiRefreshLine } from 'react-icons/ri';
import { SimpleWidget } from '../SimpleWidget';
import { useMemo } from 'react';
import { usePlayerScores, useSubmitTurnFunc } from '../../hooks/useGameContract';
import { isBroadcasting, isInBlock, isPendingSignature, shouldDisableStrict } from '../../lib/useInk/utils';
import { useExtension } from '../../lib/useInk/hooks';
import { useTranslation } from 'next-i18next';

type Props = {
  className?: string;
};

export const ConnectWallet: React.FC<Props> = ({ className }) => {
  const { setShowWalletConnect, player } = useUI();
  const scores = usePlayerScores();
  const { activeAccount } = useExtension();
  const submitTurn = useSubmitTurnFunc();
  const { t } = useTranslation('common');

  const playerName = useMemo(() => {
    const p = scores.find((s) => s.id === player);
    return p?.name || truncateHash(player || '');
  }, [scores, player]);

  const buttonTitle = () => {
    if (isPendingSignature(submitTurn)) return t('pendingSignature');
    if (isBroadcasting(submitTurn)) return t('broadcasting');
    if (isInBlock(submitTurn)) return t('inBlock');
    return t('submitTurn');
  };

  if (!activeAccount || !player) {
    return (
      <Button
        className={classNames('rounded-md text-sm uppercase duration-25 transition px-6 py-4 text-center', className)}
        onClick={() => setShowWalletConnect(true)}
      >
        {t('joinGame')}
      </Button>
    );
  }

  return (
    <SimpleWidget className="md:right-3 right-0 bottom-3 w-full max-w-xl fixed">
      <div className="flex justify-between gap-10">
        <div className="flex justify-start items-center gap-2 w-full">
          <Button className="px-2 bg-squink-800 border-0" onClick={() => setShowWalletConnect(true)}>
            <RiRefreshLine size={18} />
          </Button>

          <div className="w-full">
            <span className="flex items-center gap-2">
              <GiWallet size={18} />
              {activeAccount.meta.name}
            </span>
            <span className="flex items-center gap-2 mt-1">
              <GiScrollUnfurled size={18} />
              {playerName}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 w-full relative z-10">
          <Button
            className="w-full bg-players-2 hover:bg-players-2/80 border-2 border-brand-300 drop-shadow-md disabled:bg-players-2/60 disabled:text-gray-300"
            disabled={shouldDisableStrict(submitTurn)}
            onClick={() => player && submitTurn.send([player], {})}
          >
            {buttonTitle()}
          </Button>
        </div>
      </div>
    </SimpleWidget>
  );
};
