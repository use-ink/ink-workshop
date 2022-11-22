import BN from 'bn.js';
import { Registry, WeightV2 } from '../../types';

export const toWeightV2 = (registry: Registry, refTime: BN, proofSize: BN): WeightV2 =>
  registry.createType('WeightV2', { refTime, proofSize });
