import { ContractPromise } from '@polkadot/api-contract';
import BN from 'bn.js';
import { AbiMessage, AccountId, ContractExecResult, ContractOptions } from '../../types';

export async function callContract(
  contract: ContractPromise,
  abiMessage: AbiMessage,
  caller: AccountId | undefined,
  args = [] as unknown[],
  options?: ContractOptions,
): Promise<ContractExecResult> {
  const { value, gasLimit, storageDepositLimit } = options || {};

  return await contract.api.call.contractsApi.call<ContractExecResult>(
    caller,
    contract.address,
    value ?? new BN(0),
    gasLimit ?? null,
    storageDepositLimit ?? null,
    abiMessage.toU8a(args),
  );
}
