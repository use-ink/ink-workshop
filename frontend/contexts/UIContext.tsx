import React, { createContext, ReactNode, useContext, useState } from 'react';

const DEFAULT_RPC_URL = 'wss://rococo-contracts-rpc.polkadot.io';
// const DEFAULT_RPC_URL = 'ws://127.0.0.1:9944';

type UI = {
  showAccounts: boolean;
  showWalletConnect: boolean;
  setShowWalletConnect: (show: boolean) => void;
  setGameAddress: (address: string | null) => void;
  setRpcURL: (url: string) => void;
  rpcURL: string;
  game: {
    address: string | null;
  };
};

const DEFAULT_UI: UI = {
  showAccounts: false,
  showWalletConnect: false,
  setShowWalletConnect: (_: boolean) => null,
  rpcURL: DEFAULT_RPC_URL,
  setRpcURL: (_: string) => null,
  setGameAddress: (_: string | null) => null,
  game: {
    address: null,
  },
};

const useUIValues = (): UI => {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [gameAddress, setGameAddress] = useState<string | null>(null);
  const [rpcURL, setRpcURL] = useState<string>(DEFAULT_RPC_URL);
  return {
    ...DEFAULT_UI,
    showWalletConnect,
    setShowWalletConnect,
    setRpcURL,
    rpcURL,
    setGameAddress,
    game: {
      address: gameAddress,
    },
  };
};

export const UIContext = createContext<UI>(DEFAULT_UI);

export const useUI = () => useContext(UIContext);

const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useUIValues();
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export default UIProvider;
