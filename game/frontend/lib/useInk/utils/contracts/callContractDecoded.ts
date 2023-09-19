import { ContractPromise } from '@polkadot/api-contract';
import { AbiMessage, AccountId, ContractExecResultDecoded, Result } from '../../types';
import { callContract } from './callContract';
import { decodeContractExecResult } from './decodeContractExecResult';

export async function callContractDecoded<T>(
  contract: ContractPromise,
  abiMessage: AbiMessage,
  caller: AccountId,
  args = [] as unknown[],
): Promise<Result<ContractExecResultDecoded<T>, string>> {
  const callResult = await callContract(contract, abiMessage, caller, args);

  const decoded = decodeContractExecResult<T>(callResult.result, abiMessage, contract.abi.registry);
  if (!decoded.ok) return decoded;

  const { gasConsumed, gasRequired, storageDeposit, debugMessage } = callResult;

  return {
    ok: true,
    value: {
      gasConsumed,
      gasRequired,
      storageDeposit,
      debugMessage: debugMessage.toHuman(),
      result: decoded.value,
    },
  };
}
