import { AbiMessage, ContractOptions } from '@polkadot/api-contract/types';
import { ContractExecResult } from '@polkadot/types/interfaces';
import { Result } from './result';
import { ISubmittableResult, Status, StorageDeposit, Weight } from './substrate';

export type { ContractExecResult, ContractExecResultResult } from '@polkadot/types/interfaces';
export type { AbiMessage, ContractOptions } from '@polkadot/api-contract/types';

export type AccountId = string;

export type DecodedResult<T> = Result<T, string>;

export interface ContractCallResult {
  readonly callResult: ContractExecResult;
  readonly abiMessage: AbiMessage;
}

export interface ContractExecResultDecoded<T> {
  readonly gasConsumed: Weight;
  readonly gasRequired: Weight;
  readonly storageDeposit: StorageDeposit;
  readonly debugMessage: string;
  readonly result: T;
}

export type ContractTxFunc = {
  send: (args: unknown[], options?: ContractOptions) => any;
  status: Status;
  error?: string | null;
  result: ISubmittableResult | undefined;
  resetState: () => void;
};
