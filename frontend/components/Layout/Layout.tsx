import dynamic from 'next/dynamic';
import { LottieEntity } from '../LottieEntity';
import { Notifications } from './Notifications';
import { Rules } from './Rules';

const ConnectWalletModal = dynamic(() => import('../ConnectWalletModal').then((mod) => mod.ConnectWalletModal), {
  ssr: false,
});

const Nav = dynamic(() => import('./Nav').then((mod) => mod.Nav), {
  ssr: false,
});

type Props = {
  children?: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-sea bg-cover bg-no-repeat bg-bottom fixed top-0 left-0 right-0 bottom-0 w-full h-screen">
      <LottieEntity src="/sea-creatures.json" className="absolute left-[0] right-[0] bottom-[0]" />
      <Nav />
      <div>{children}</div>
      <Rules />
      <ConnectWalletModal />
      <Notifications />
    </div>
  );
};
