import React, { createContext, useContext, useEffect, useState } from 'react';
import { Extension, EXTENSION_DEFAULTS, useExtension } from './hooks/useExtension';
import { Header } from '@polkadot/types/interfaces';
import { useApi } from './hooks/useApi';
import { ApiPromise } from '@polkadot/api';
import { useGameContract } from '../../hooks/useGameContract';
import { ContractPromise } from '@polkadot/api-contract';

type InkDappItems = Extension & {
  header?: Header;
  api?: ApiPromise;
  game?: ContractPromise;
};

const DEFAULTS: InkDappItems = {
  ...EXTENSION_DEFAULTS,
};

const InkContext = createContext<InkDappItems>({
  ...DEFAULTS,
});

type InkConfig = {
  children?: React.ReactNode;
};

const InkProvider: React.FC<InkConfig> = ({ children }) => {
  const extension = useExtension();
  const DEFAULT_RPC_URL = 'wss://rococo-contracts-rpc.polkadot.io';
  const api = useApi(DEFAULT_RPC_URL);
  const [header, setHeader] = useState<Header | undefined>();
  const game = useGameContract();

  useEffect(() => {
    async function listenToBlocks() {
      return api?.rpc.chain.subscribeNewHeads(setHeader);
    }
    let cleanUp: VoidFunction | undefined;
    listenToBlocks()
      .then((unsub) => (cleanUp = unsub))
      .catch(console.error);

    return () => cleanUp && cleanUp();
  }, [api]);

  return <InkContext.Provider value={{ ...DEFAULTS, ...extension, header, api, game }}>{children}</InkContext.Provider>;
};

export const useInk = () => useContext(InkContext);

export default InkProvider;
