/* eslint-disable @next/next/no-img-element */
import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { GiSpiralShell } from 'react-icons/gi';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useUI } from '../../contexts/UIContext';
import { useBuyInAmount, useGameState, useRegisterPlayerFunc } from '../../hooks/useGameContract';
import { useInk } from '../../lib/useInk';
import { hasAny } from '../../lib/useInk/utils';
import { truncateHash } from '../../utils';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { ToggleSwitchLabel } from '../ToggleSwitchLabel';
import { PlayerSelect } from './PlayerSelect';

export const ConnectWalletModal: React.FC = () => {
  const { setShowWalletConnect, showWalletConnect, player, setPlayer } = useUI();
  const { fetchAccounts, accounts, setActiveAccount, activeAccount } = useInk();
  const [playerAddress, setPlayerAddress] = useState<string>(player || '');
  const [playerName, setPlayerName] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const registerFunc = useRegisterPlayerFunc();
  const gameState = useGameState();
  const buyInAmount = useBuyInAmount();

  const hasAccounts = Boolean(accounts?.length);
  const noSpecialChars = /^[A-Za-z0-9]{1,12}$/;
  const hasValidPlayerName = noSpecialChars.test(playerName);

  useEffect(() => {
    showWalletConnect && fetchAccounts();
  }, [showWalletConnect]);

  useEffect(() => {
    if (registerFunc.status === 'finalized') {
      setPlayer(playerAddress);
      setShowWalletConnect(false);
    }
  }, [registerFunc.status]);

  const registerPlayerButtonTitle = () => {
    if ('broadcasted' === registerFunc.status) return 'Broadcasting...';
    if ('pending' === registerFunc.status) return 'Awaiting signature...';
    if ('in-block' === registerFunc.status) return 'In block...';
    return 'Register!';
  };

  return (
    <Modal open={showWalletConnect} handleClose={() => setShowWalletConnect(false)}>
      <div className="bg-brand-600 text-white max-w-4xl w-full">
        <div className="p-6 px-12">
          <div>
            <h3 className="text-center">1. Choose a wallet address</h3>
            <div className="mt-3">
              {!hasAccounts && (
                <span className="flex items-center justify-center max-w-md mx-auto gap-2 mb-6">
                  <span>
                    <RiErrorWarningFill size={28} />
                  </span>
                  <p className="text-white/80 text-start">Please connect your wallet to this site.</p>
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
                  <h3 className="text-center">2. Register a Player</h3>
                  <ToggleSwitchLabel
                    className="mt-3"
                    handleClick={() => setAlreadyRegistered(!alreadyRegistered)}
                    isOn={alreadyRegistered}
                    label="I've already registered"
                  />

                  {gameState?.status === 'Forming' ? (
                    <>
                      <span className="flex items-center justify-start gap-2 mt-1 text-white/80">
                        <GiSpiralShell size={28} />
                        <p className="font-semibold text-xs">
                          BUY IN:{' '}
                          <span className="ml-1 bg-white/20 rounded-full py-[2px] px-2">
                            {buyInAmount !== null && `${buyInAmount.div(new BN(1e12)).toString()} ROC`}
                          </span>
                        </p>
                      </span>
                      <span className="flex items-center text-white/80 w-full text-left mt-3 gap-2">
                        <p className="text-xs font-semibold ">NAME</p>
                        <p className="text-[10px]">(1-12 characters. No spaces, dashes, or underscores)</p>
                      </span>
                      <input
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="disabled:hover:cursor-not-allowed disabled:bg-white/60 rounded-2xl bg-players-6 mt-1 flex items-center justify-center text-center min-h-12 w-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-players-9 text-brand-500"
                        placeholder="Your name..."
                        disabled={hasAny(registerFunc, 'pending', 'broadcasted', 'in-block')}
                        autoFocus={false}
                        value={playerName}
                      />
                      {playerName.length > 0 && !hasValidPlayerName && (
                        <p className="text-xs mt-2 text-players-2">Invalid player name</p>
                      )}

                      <p className="text-xs font-semibold text-white/80 w-full text-left mt-3">ADDRESS</p>
                      <input
                        onChange={(e) => setPlayerAddress(e.target.value)}
                        className="disabled:hover:cursor-not-allowed disabled:bg-white/60 rounded-2xl bg-players-6 mt-1 flex items-center justify-center text-center min-h-12 w-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-players-9 text-brand-500"
                        placeholder="Contract address..."
                        disabled={hasAny(registerFunc, 'pending', 'broadcasted', 'in-block')}
                        autoFocus={false}
                        value={playerAddress}
                      />
                      {playerAddress.length > 0 && playerAddress.length !== 48 && (
                        <p className="text-xs mt-2 text-players-2">Invalid address</p>
                      )}
                      <button
                        className="font-fred w-full mt-6 rounded-2xl py-4 px-6 bg-players-2 hover:bg-players-2/80 disabled:hover:cursor-not-allowed disabled:bg-players-2/50 drop-shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-players-9"
                        disabled={
                          playerAddress.length != 48 ||
                          !activeAccount ||
                          !hasValidPlayerName ||
                          hasAny(registerFunc, 'pending', 'broadcasted', 'in-block')
                        }
                        onClick={() => {
                          registerFunc.send(playerAddress, playerName, buyInAmount);
                        }}
                      >
                        {registerPlayerButtonTitle()}
                      </button>
                    </>
                  ) : (
                    <p className="mt-3 text-center">You must register before the game starts</p>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-center">2. Select a Player</h3>
                  <ToggleSwitchLabel
                    className="mt-3"
                    handleClick={() => setAlreadyRegistered(!alreadyRegistered)}
                    isOn={alreadyRegistered}
                    label="I've already registered"
                  />
                  <PlayerSelect className="mt-3" />
                  <button
                    className="font-fred w-full mt-3 rounded-2xl py-4 px-6 bg-players-2 hover:bg-players-2/80 disabled:hover:cursor-not-allowed disabled:bg-players-2/50 drop-shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-players-9"
                    disabled={!player || !activeAccount}
                    onClick={() => {
                      setShowWalletConnect(false);
                    }}
                  >
                    I&apos;m ready!
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
