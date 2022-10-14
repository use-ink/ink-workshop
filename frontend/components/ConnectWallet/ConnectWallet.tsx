import { useUI } from '../../contexts/UIContext';
import { useInk } from '../../lib/useInk';
import { Button } from '../Button';
import { Identicon } from '@polkadot/react-identicon';
import classNames from 'classnames';

type Props = {
  className?: string;
};

export const ConnectWallet: React.FC<Props> = ({ className }) => {
  const { setShowWalletConnect } = useUI();
  const { activeAccount } = useInk();

  if (activeAccount) {
    return (
      <Button className={classNames('flex items-center gap-2', className)} onClick={() => setShowWalletConnect(true)}>
        {activeAccount.meta.name}
        <Identicon value={activeAccount.address} size={22} theme="beachball" />
      </Button>
    );
  }

  return (
    <Button
      className={classNames('rounded-md text-sm uppercase duration-25 transition px-6 py-2 text-center', className)}
      onClick={() => setShowWalletConnect(true)}
    >
      Connect Wallet
    </Button>
  );
};
