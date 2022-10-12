import { ApiPromise } from '@polkadot/api';
import { useEffect, useState } from 'react';
import { useProvider } from './useProvider';

export const useApi = (providerUrl: string): ApiPromise | undefined => {
  const [api, setApi] = useState<ApiPromise | undefined>();
  const provider = useProvider(providerUrl);

  useEffect(() => {
    ApiPromise.create({ provider }).then((api) => {
      setApi(api);
    });
  }, [providerUrl, provider]);

  return api;
};
