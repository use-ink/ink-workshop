import dynamic from 'next/dynamic';
import { Entity } from '../Entity';

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
      <ConnectWalletModal />
      <Nav />
      <Entity
        alt="plant"
        src="/plant-2.svg"
        className="absolute left-[5%] bottom-[-1%] w-[15%] min-w-[150px] hidden md:block"
      />
      <Entity
        alt="plant"
        src="/plant-1.svg"
        className="absolute right-[5%] bottom-0 md:w-[35%] w-[80%] max-w-[500px] min-w-[350px]"
      />
      <Entity alt="fish" src="/fish-1.svg" className="absolute left-[2%] xl:bottom-[35%] bottom-[15%] w-20" />
      <Entity alt="Jelly" src="/jelly-fish.svg" className="absolute right-[3%] xl:top-[34%] top-[15%] md:w-32 w-20" />
      <div className="">{children}</div>
    </div>
  );
};
