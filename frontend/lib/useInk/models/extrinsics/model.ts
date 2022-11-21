export type ExtrinsicStatus =
  | 'none'
  | 'signature-requested'
  | 'pre-flight-started'
  | 'pre-flight-completed'
  | 'broadcasted'
  | 'added-to-block'
  | 'finalized'
  | 'errored';

export type Response = {
  status: ExtrinsicStatus;
};

export const isNone = (func: { status: ExtrinsicStatus }): boolean => func.status === 'none';

export const isPreFlight = (func: { status: ExtrinsicStatus }): boolean => func.status === 'pre-flight-started';

export const isPendingSignature = (func: { status: ExtrinsicStatus }): boolean => func.status === 'signature-requested';

export const isBroadcasting = (func: { status: ExtrinsicStatus }): boolean => func.status === 'broadcasted';

export const isInBlock = (func: { status: ExtrinsicStatus }): boolean => func.status === 'added-to-block';

export const hasAny = (func: { status: ExtrinsicStatus }, ...statuses: ExtrinsicStatus[]): boolean =>
  statuses.includes(func.status);

export const isFinalized = (func: { status: ExtrinsicStatus }): boolean => func.status === 'finalized';

export const errored = (func: { status: ExtrinsicStatus }): boolean => func.status === 'errored';
