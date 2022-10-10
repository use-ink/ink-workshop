import { ApiPromise, WsProvider } from '@polkadot/api';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { useEffect, useState } from 'react';

export type ContractAbi = string | Record<string, unknown> | Abi;

export function useContract<T extends ContractPromise = ContractPromise>(
  address: string,
  ABI: ContractAbi,
  providerUrl: string,
): T | null {
  const [contract, setContract] = useState<T | null>(null);

  useEffect(() => {
    try {
      const wsProvider = new WsProvider(providerUrl);
      ApiPromise.create({ provider: wsProvider }).then((api) =>
        setContract(new ContractPromise(api, ABI, address) as T),
      );
    } catch (err) {
      console.error("Couldn't connect to wallet: ", err);
    }
  }, [ABI, address, providerUrl]);

  return contract;
}
