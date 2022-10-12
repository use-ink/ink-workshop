import { Abi, ContractPromise } from '@polkadot/api-contract';
import { useEffect, useState } from 'react';
import { useInk } from '../InkProvider';

export type ContractAbi = string | Record<string, unknown> | Abi;

export function useContract<T extends ContractPromise = ContractPromise>(
  address: string,
  ABI: ContractAbi,
): T | undefined {
  const [contract, setContract] = useState<T | undefined>();
  const { api } = useInk();

  useEffect(() => {
    try {
      api && setContract(new ContractPromise(api, ABI, address) as T);
    } catch (err) {
      console.error("Couldn't connect to wallet: ", err);
    }
  }, [ABI, address, api]);

  return contract;
}
