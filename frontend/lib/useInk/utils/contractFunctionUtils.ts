export type Status = 'pending' | 'pre-flight' | 'broadcasted' | 'in-block' | 'finalized' | 'none';

export type Response = {
  status: Status;
};

export const isNone = (func: { status: Status }): boolean => func.status === 'none';

export const isPreFlight = (func: { status: Status }): boolean => func.status === 'pre-flight';

export const isPendingSignature = (func: { status: Status }): boolean => func.status === 'pending';

export const isBroadcasting = (func: { status: Status }): boolean => func.status === 'broadcasted';

export const isInBlock = (func: { status: Status }): boolean => func.status === 'in-block';

export const hasAny = (func: { status: Status }, ...statuses: Status[]): boolean => statuses.includes(func.status);

export const isFinalized = (func: { status: Status }): boolean => func.status === 'finalized';
