import { ContractPromise } from '@polkadot/api-contract';
import { useMemo } from 'react';
import { ContractExecResultDecoded, ContractOptions, Result } from '../types';
import { decodeContractExecResult } from '../utils';
import { useContractCall } from './useContractCall';

export function useContractCallDecoded<T>(
  contract: ContractPromise | undefined,
  message: string,
  args = [] as unknown[],
  options?: ContractOptions,
): Result<ContractExecResultDecoded<T>, string> | null {
  const rawResult = useContractCall(contract, message, args, options);

  return useMemo(() => {
    if (!rawResult || !contract) return null;
    if (!rawResult.ok) return rawResult;

    const { callResult, abiMessage } = rawResult.value;

    const result = decodeContractExecResult<T>(callResult.result, abiMessage, contract.abi.registry);
    if (!result.ok) return result;

    return {
      ok: true,
      value: {
        ...callResult,
        debugMessage: rawResult.value.callResult.debugMessage.toHuman(),
        result: result.value,
      },
    };
  }, [rawResult]);
}
