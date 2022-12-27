export type { AnyJson, Codec, Registry, RegistryError, TypeDef, ISubmittableResult } from '@polkadot/types/types';
export type { Weight, WeightV2, Balance, StorageDeposit, ExtrinsicStatus } from '@polkadot/types/interfaces';

import { ExtrinsicStatus } from '@polkadot/types/interfaces';

export type Status = 'None' | 'PreFlight' | 'PendingSignature' | ExtrinsicStatus['type'] | 'Errored';
