import React, { PropsWithChildren } from 'react';
export interface DeployerContextProps {
    metadata: Record<string, unknown>;
    constructorArgs: Record<string, unknown> | undefined;
    constructorName: string;
    codeHash: string;
}
export interface DeployerState {
    contractAddress?: string;
    clearContract: () => void;
}
export declare const DeployerProvider: React.FC<PropsWithChildren<DeployerContextProps>>;
export declare const useDeployerState: () => DeployerState;
