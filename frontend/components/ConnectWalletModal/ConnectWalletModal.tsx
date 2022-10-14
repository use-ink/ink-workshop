/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react';
import { useUI } from '../../contexts/UIContext';
import { useInk } from '../../lib/useInk';
import { Button } from '../Button';
import { Modal } from '../Modal';

export const ConnectWalletModal: React.FC = () => {
  const { setShowWalletConnect, showWalletConnect } = useUI();
  const { fetchAccounts, accounts, setActiveAccount, activeAccount } = useInk();

  useEffect(() => {
    showWalletConnect && fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWalletConnect]);

  return (
    <Modal open={showWalletConnect} handleClose={() => setShowWalletConnect(false)}>
      <div className="bg-brand-600 text-white p-6 max-w-3xl w-full">
        <h3 className="text-center">Choose a wallet address to connect</h3>
        <div className="mt-6">
          {accounts?.map((account) => (
            <Button
              key={account.address}
              className="mt-3 flex items-center gap-2 w-full pl-3"
              onClick={() => {
                setActiveAccount(account);
                setShowWalletConnect(false);
              }}
            >
              <span className="w-8 h-8 flex items-center justify-center">
                {account.address === activeAccount?.address && <img src="/sea-horse.svg" className="w-12" alt="icon" />}
              </span>
              <span className="flex flex-col items-start">
                <h6 className="text-md">{account.meta.name}</h6>
                <span className="text-xs">{account.address}</span>
              </span>
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
