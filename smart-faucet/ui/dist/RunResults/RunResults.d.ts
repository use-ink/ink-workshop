import React from 'react';
import { IApiProvider } from 'useink';
import { StorageDeposit, WeightV2 } from 'useink/core';
export interface RunResultsProps {
    title?: string;
    className?: string;
    contractAddress?: string;
    storageDeposit?: StorageDeposit;
    gasConsumed?: WeightV2;
    gasRequired?: WeightV2;
    chainApi: IApiProvider | undefined;
}
export declare const RunResults: React.FC<RunResultsProps>;
