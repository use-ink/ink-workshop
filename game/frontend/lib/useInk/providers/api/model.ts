import { ApiPromise } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';

export type API = {
  api?: ApiPromise;
  provider?: ProviderInterface;
};
