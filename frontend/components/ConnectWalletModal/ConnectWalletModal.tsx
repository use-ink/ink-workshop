/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useUI } from '../../contexts/UIContext';
import { useInk } from '../../lib/useInk';
import { truncateHash } from '../../utils';
import { Button } from '../Button';
import { Modal } from '../Modal';

export const ConnectWalletModal: React.FC = () => {
  const { setShowWalletConnect, showWalletConnect, player, setPlayer } = useUI();
  const { fetchAccounts, accounts, setActiveAccount, activeAccount } = useInk();
  const [playerAddress, setPlayerAddress] = useState<string>(player || '');

  useEffect(() => {
    showWalletConnect && fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWalletConnect]);

  return (
    <Modal open={showWalletConnect} handleClose={() => setShowWalletConnect(false)}>
      <div className="bg-brand-600 text-white p-6 max-w-3xl w-full">
        <div className="mt-6">
          <h3 className="text-center">1. Choose a wallet address</h3>
          <div className="mt-6">
            {accounts?.map((account) => (
              <Button
                key={account.address}
                className="mt-3 flex items-center gap-2 w-full pl-3"
                onClick={() => {
                  setActiveAccount(account);
                }}
              >
                <span className="w-8 h-8 flex items-center justify-center">
                  {account.address === activeAccount?.address && (
                    <img src="/sea-horse.svg" className="w-12" alt="icon" />
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

        <div className="mt-10">
          <h3 className="text-center">2. Set your Player contract address</h3>
          <input
            onChange={(e) => setPlayerAddress(e.target.value)}
            className="rounded-2xl bg-players-6 mt-6 flex items-center justify-center text-center min-h-12 w-full py-4 px-6 focus:outline-none focus:ring-4 focus:ring-players-9 text-brand-500"
            placeholder="Player address..."
            autoFocus={false}
            value={playerAddress}
          />
          <button
            className="font-fred w-full mt-10 rounded-2xl py-4 px-6 bg-players-2 hover:bg-players-2/80 disabled:hover:cursor-not-allowed disabled:bg-players-2/50 drop-shadow-md transition duration-200 focus:outline-none focus:ring-4 focus:ring-players-9"
            disabled={playerAddress.length === 0 || !activeAccount}
            onClick={() => {
              setPlayer(playerAddress);
              setShowWalletConnect(false);
            }}
          >
            I&apos;m ready!
          </button>
          <button
            className="text-white font-fred w-full mt-3 rounded-2xl py-4 px-6 bg-brand-300 hover:bg-brand-300/80 drop-shadow-md transition duration-200 focus:outline-none focus:ring-4 focus:ring-players-9"
            onClick={() => setShowWalletConnect(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
