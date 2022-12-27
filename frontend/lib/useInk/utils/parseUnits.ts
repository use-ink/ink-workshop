import { ethers } from 'ethers';
import BN from 'bn.js';

const DECIMALS_DOT = 10;
const DECIMALS_ROC = 12;

export const parseUnits = (value: string, decimals = DECIMALS_ROC): BN => {
  const n = ethers.utils.parseUnits(value, decimals);
  return new BN(n.toString());
};

export const stringNumberToBN = (valWithCommas: string): BN => new BN(valWithCommas.split(',').join(''));
