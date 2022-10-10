import { useUI } from '../../contexts/UIContext';
import { useInk } from '../../lib/useInk';
import { Button } from '../Button';
import { Identicon } from '@polkadot/react-identicon';

export const ConnectWallet: React.FC = () => {
  const { setShowWalletConnect } = useUI();
  const { activeAccount } = useInk();

  if (activeAccount) {
    return (
      <span className="flex items-center gap-2">
        <button onClick={() => setShowWalletConnect(true)} className="accountDetailHeader">
          {activeAccount.meta.name}
        </button>
        <Identicon value={activeAccount.address} size={32} theme="beachball" />
      </span>
    );
  }

  return (
    <Button
      className="rounded-md text-sm uppercase duration-25 transition px-6 py-2 text-center"
      onClick={() => setShowWalletConnect(true)}
    >
      Connect Wallet
    </Button>
  );
};
