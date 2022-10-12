import { WsProvider } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { useEffect, useState } from 'react';

export const useProvider = (providerUrl: string): ProviderInterface | undefined => {
  const [provider, setProvider] = useState<WsProvider | undefined>(undefined);

  useEffect(() => {
    setProvider(new WsProvider(providerUrl));
  }, [providerUrl]);

  return provider;
};
