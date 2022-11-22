import { ContractPromise } from '@polkadot/api-contract';
import { useEffect, useMemo, useState } from 'react';
import { ContractCallResult, ContractExecResult, ContractOptions, Result } from '../types';
import { callContract, toContractAbiMessage } from '../utils';
import { useBlockHeader } from './useBlockHeader';
import { useExtension } from './useExtension';

export function useContractCall(
  contract: ContractPromise | undefined,
  message: string,
  args = [] as unknown[],
  options?: ContractOptions,
): Result<ContractCallResult, string> | null {
  const [callResult, setCallResult] = useState<ContractExecResult | null>(null);
  const { blockNumber } = useBlockHeader();
  const { activeAccount } = useExtension();

  const abiMsgResult = useMemo(() => {
    if (!contract) return null;
    return toContractAbiMessage(contract, message);
  }, [contract, message]);

  useEffect(() => {
    abiMsgResult &&
      abiMsgResult.ok &&
      contract &&
      callContract(contract, abiMsgResult.value, activeAccount?.address, args, options).then((r) => {
        setCallResult(r);
      });
  }, [contract?.address, blockNumber, activeAccount?.address, abiMsgResult]);

  if (!abiMsgResult || !callResult) return null;
  if (!abiMsgResult.ok) return abiMsgResult;

  return {
    ok: true,
    value: {
      callResult,
      abiMessage: abiMsgResult.value,
    },
  };
}
