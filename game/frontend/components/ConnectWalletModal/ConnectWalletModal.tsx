/* eslint-disable @next/next/no-img-element */
import BN from 'bn.js';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GiSpiralShell } from 'react-icons/gi';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useUI } from '../../contexts/UIContext';
import { useBuyInAmount, useGameState, useRegisterPlayerFunc } from '../../hooks/useGameContract';
import { useExtension } from '../../lib/useInk/hooks';
import { shouldDisable } from '../../lib/useInk/utils';
import { truncateHash } from '../../utils';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { ToggleSwitchLabel } from '../ToggleSwitchLabel';
import { PlayerSelect } from './PlayerSelect';

const MIN_BYTE_COUNT = 3;
const MAX_BYTE_COUNT = 16;

export const ConnectWalletModal: React.FC = () => {
  const { setShowWalletConnect, showWalletConnect, player, setPlayer } = useUI();
  const { fetchAccounts, accounts, setActiveAccount, activeAccount } = useExtension();
  const [playerAddress, setPlayerAddress] = useState<string>(player || '');
  const [playerName, setPlayerName] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const registerFunc = useRegisterPlayerFunc();
  const gameState = useGameState();
  const buyInAmount = useBuyInAmount();
  const { t } = useTranslation('common');

  const playerNameByteSize = useMemo(() => new Blob([playerName]).size, [playerName]);

  const hasAccounts = Boolean(accounts?.length);
  const hasValidPlayerName = playerNameByteSize >= MIN_BYTE_COUNT && playerNameByteSize <= MAX_BYTE_COUNT;

  useEffect(() => {
    showWalletConnect && fetchAccounts();
  }, [showWalletConnect]);

  useEffect(() => {
    if (registerFunc.status === 'InBlock') {
      setPlayer(playerAddress);
      setShowWalletConnect(false);
    }
  }, [registerFunc.status]);

  const registerPlayerButtonTitle = () => {
    if ('PreFlight' === registerFunc.status) return t('calculatingGas');
    if ('Broadcast' === registerFunc.status) return t('broadcasting');
    if ('PendingSignature' === registerFunc.status) return t('pendingSignature');
    if ('InBlock' === registerFunc.status) return t('inBlock');
    return t('register');
  };

  return (
    <Modal open={showWalletConnect} handleClose={() => setShowWalletConnect(false)}>
      <div className="bg-brand-600 text-white max-w-4xl w-full">
        <div className="p-6 px-12">
          <div>
            <h3 className="text-center">{t('chooseWalletAddress')}</h3>
            <div className="mt-3">
              {!hasAccounts && (
                <span className="flex items-center justify-center max-w-md mx-auto gap-2 mb-6">
                  <span>
                    <RiErrorWarningFill size={28} />
                  </span>
                  <p className="text-white/80 text-start">{t('pleaseConnectWallet')}</p>
                </span>
              )}
              {hasAccounts &&
                accounts?.map((account) => (
                  <Button
                    key={account.address}
                    className="mt-3 flex items-center gap-2 w-full pl-3"
                    onClick={() => {
                      setActiveAccount(account);
                    }}
                  >
                    <span className="w-8 h-8 flex items-center justify-center">
                      {account.address === activeAccount?.address ? (
                        <img src="/sea-horse.svg" className="w-12" alt="icon" />
                      ) : (
                        <img src="/sea-horse-silhuoette.svg" className="w-12" alt="icon" />
                      )}
                    </span>
                    <span className="flex flex-col items-start">
                      <h6 className="text-md">{account.meta.name}</h6>
                      <span className="text-xs">{truncateHash(account.address)}</span>
                    </span>
                  </Button>
                ))}
            </div>
          </div>

          {activeAccount && (
            <div className="mt-6">
              {!alreadyRegistered ? (
                <div>
                  <h3 className="text-center">{t('registerPlayer')}</h3>
                  <ToggleSwitchLabel
                    className="mt-3"
                    handleClick={() => setAlreadyRegistered(!alreadyRegistered)}
                    isOn={alreadyRegistered}
                    label={t('alreadyRegistered')}
                  />

                  {gameState?.status === 'Forming' ? (
                    <>
                      <span className="flex items-center justify-start gap-2 mt-1 text-white/80">
                        <GiSpiralShell size={28} />
                        <p className="font-semibold text-xs">
                          {t('buyIn')}:{' '}
                          <span className="ml-1 bg-white/20 rounded-full py-[2px] px-2">
                            {buyInAmount !== null && `${buyInAmount.div(new BN(1e12)).toString()} ROC`}
                          </span>
                        </p>
                      </span>
                      <span className="flex items-center text-white/80 w-full text-left mt-3 gap-2">
                        <p className="text-xs font-semibold ">{t('name')}</p>
                        <p className="text-[10px]">
                          {t('nameRequirements', { min: MIN_BYTE_COUNT, max: MAX_BYTE_COUNT })}
                        </p>
                      </span>
                      <input
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="disabled:hover:cursor-not-allowed disabled:bg-white/60 rounded-2xl bg-players-6 mt-1 flex items-center justify-center text-center min-h-12 w-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-players-9 text-brand-500"
                        placeholder={t('yourName') || 'Your name...'}
                        disabled={shouldDisable(registerFunc)}
                        autoFocus={false}
                        value={playerName}
                      />
                      {playerName.length > 0 && !hasValidPlayerName && (
                        <p className="text-xs mt-2 text-players-2">{t('invalidName')}</p>
                      )}

                      <p className="text-xs font-semibold text-white/80 w-full text-left mt-3 uppercase">
                        {t('address')}
                      </p>
                      <input
                        onChange={(e) => setPlayerAddress(e.target.value)}
                        className="disabled:hover:cursor-not-allowed disabled:bg-white/60 rounded-2xl bg-players-6 mt-1 flex items-center justify-center text-center min-h-12 w-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-players-9 text-brand-500"
                        placeholder={t('contractAddress') || 'Contract address'}
                        disabled={shouldDisable(registerFunc)}
                        autoFocus={false}
                        value={playerAddress}
                      />
                      {playerAddress.length > 0 && playerAddress.length !== 48 && (
                        <p className="text-xs mt-2 text-players-2">{t('invalidAddress')}</p>
                      )}
                      <button
                        className="font-fred w-full mt-6 rounded-2xl py-4 px-6 bg-players-2 hover:bg-players-2/80 disabled:hover:cursor-not-allowed disabled:bg-players-2/50 drop-shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-players-9"
                        disabled={
                          playerAddress.length != 48 ||
                          !activeAccount ||
                          !hasValidPlayerName ||
                          shouldDisable(registerFunc)
                        }
                        onClick={() => {
                          registerFunc.send([playerAddress, playerName], { value: buyInAmount ?? undefined });
                        }}
                      >
                        {registerPlayerButtonTitle()}
                      </button>
                    </>
                  ) : (
                    <p className="mt-3 text-center">{t('registerBeforeGameStart')}</p>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-center">{t('selectPlayer')}</h3>
                  <ToggleSwitchLabel
                    className="mt-3"
                    handleClick={() => setAlreadyRegistered(!alreadyRegistered)}
                    isOn={alreadyRegistered}
                    label={t('alreadyRegistered')}
                  />
                  <PlayerSelect className="mt-3" />
                  <button
                    className="font-fred w-full mt-6 rounded-2xl py-4 px-6 bg-players-2 hover:bg-players-2/80 disabled:hover:cursor-not-allowed disabled:bg-players-2/50 drop-shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-players-9"
                    disabled={!player || !activeAccount}
                    onClick={() => {
                      setShowWalletConnect(false);
                    }}
                  >
                    {t('imReady')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
