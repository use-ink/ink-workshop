import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { useApi } from './useApi';

export const useProvider = (): ProviderInterface | undefined => useApi().provider;
