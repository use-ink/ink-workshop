import React, { createContext, useContext, useEffect, useState } from 'react';
import { Extension, EXTENSION_DEFAULTS, useExtension } from './hooks/useExtension';
import { Header } from '@polkadot/types/interfaces';
import { useApi } from './hooks/useApi';
import { ApiPromise } from '@polkadot/api';
import { useGameContract } from '../../hooks/useGameContract';
import { ContractPromise } from '@polkadot/api-contract';
import { DEFAULT_RPC_URL } from './constants';

type InkDappItems = Extension & {
  header?: Header;
  currentBlock?: number;
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
  const api = useApi(DEFAULT_RPC_URL);
  const [header, setHeader] = useState<Header | undefined>();
  const game = useGameContract();
  const currentBlock = header?.number?.toNumber();

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

  return (
    <InkContext.Provider value={{ ...DEFAULTS, ...extension, header, api, game, currentBlock }}>
      {children}
    </InkContext.Provider>
  );
};

export const useInk = () => useContext(InkContext);

export default InkProvider;
