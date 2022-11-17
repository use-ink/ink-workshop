import { APIContext } from './context';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { DEFAULT_RPC_URL } from '../../constants';

interface Props {
  children: ReactNode;
}

export const APIProvider: React.FC<Props> = ({ children }) => {
  const providerUrl = DEFAULT_RPC_URL; // TODO: get from config
  const provider = useMemo(() => new WsProvider(providerUrl), [providerUrl]);
  const [api, setApi] = useState<ApiPromise | undefined>();

  useEffect(() => {
    ApiPromise.create({ provider }).then((api) => {
      setApi(api);
    });
  }, [providerUrl, provider]);

  return <APIContext.Provider value={{ api, provider }}>{children}</APIContext.Provider>;
};
