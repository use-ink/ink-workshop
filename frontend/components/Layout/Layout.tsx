import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useUI } from '../../contexts/UIContext';
import { LottieEntity } from '../LottieEntity';
import { Notifications } from './Notifications';
import { Rules } from './Rules';

const ConnectWalletModal = dynamic(() => import('../ConnectWalletModal').then((mod) => mod.ConnectWalletModal), {
  ssr: false,
});

const GameLogs = dynamic(() => import('./GameLogs').then((mod) => mod.GameLogs), {
  ssr: false,
});

const Nav = dynamic(() => import('./Nav').then((mod) => mod.Nav), {
  ssr: false,
});

type Props = {
  children?: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  const { darkMode } = useUI();
  return (
    <div
      className={classNames(
        'bg-cover bg-no-repeat bg-bottom fixed top-0 left-0 right-0 bottom-0 w-full h-screen',
        darkMode ? 'bg-brand-800' : 'bg-brand-100',
      )}
    >
      <GameLogs />
      <LottieEntity
        src={darkMode ? '/dark-sea-creatures.json' : '/sea-creatures.json'}
        className="absolute left-[0] right-[0] bottom-[0]"
      />
      <LottieEntity src="/squink.json" className="absolute w-[800px] right-[-1%] bottom-[6%]" />
      <Nav />
      <div>{children}</div>
      <Rules />
      <ConnectWalletModal />
      <Notifications />
    </div>
  );
};
