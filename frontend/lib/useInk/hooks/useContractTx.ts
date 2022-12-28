import { ContractPromise } from '@polkadot/api-contract';
import { useMemo, useState } from 'react';
import { ContractExecResultResult, ContractOptions, ContractTxFunc, ISubmittableResult, Status } from '../types';
import { callContract, toContractAbiMessage, toRegistryErrorDecoded } from '../utils';
import { useConfig } from './useConfig';
import { useExtension } from './useExtension';
import { useNotifications } from './useNotifications';

type ContractTxOptions = {
  notificationsOff: boolean;
  notifications?: {
    broadcastMessage?: (result: ContractExecResultResult) => string;
    finalizedMessage?: (result: ContractExecResultResult) => string;
    inBlockMessage?: (result: ContractExecResultResult) => string;
    unknownErrorMessage?: (e?: unknown) => string;
  };
};

export function useContractTx(
  contract: ContractPromise | undefined,
  message: string,
  options?: ContractTxOptions,
): ContractTxFunc {
  const { activeAccount, activeSigner } = useExtension();
  const { addNotification } = useNotifications();
  const { notifications } = useConfig();
  const withNotifications = !options?.notificationsOff && !notifications?.off;
  const [status, setStatus] = useState<Status>('None');
  const [result, setResult] = useState<ISubmittableResult>();
  const [error, setError] = useState<string | null>(null);
  const { broadcastMessage, inBlockMessage, finalizedMessage, unknownErrorMessage } = options?.notifications || {};

  const send: (args: unknown[], o?: ContractOptions) => void = useMemo(
    () => (args, options) => {
      if (!activeAccount || !contract || !activeSigner) return;

      error && setError(null);
      setStatus('PendingSignature');

      const abiMessage = toContractAbiMessage(contract, message);

      if (!abiMessage.ok) {
        setError(abiMessage.error);
        setStatus('Errored');
        return;
      }

      callContract(contract, abiMessage.value, activeAccount.address, args, options)
        .then((response) => {
          const { gasRequired, result } = response;

          try {
            const dispatchError = toRegistryErrorDecoded(contract.abi.registry, result);
            if (result.isErr && dispatchError) {
              setError(dispatchError.docs.join(', '));
              console.error('dispatch error', dispatchError);

              withNotifications &&
                addNotification({
                  notification: {
                    type: 'Errored',
                    message: dispatchError.docs.join(', '),
                  },
                });

              return;
            }
          } catch (e) {
            console.error('errored', e);
          }

          contract.tx[message]({ gasLimit: gasRequired, ...(options || {}) }, ...args)
            .signAndSend(activeAccount.address, { signer: activeSigner.signer }, (response) => {
              setResult(response);
              if (response.status.isBroadcast) {
                setStatus('Broadcast');

                withNotifications &&
                  addNotification({
                    notification: {
                      type: 'Broadcast',
                      message: broadcastMessage ? broadcastMessage(result) : 'Broadcast',
                    },
                  });
              }

              if (response.status.isInBlock) {
                setStatus('InBlock');

                withNotifications &&
                  addNotification({
                    notification: {
                      type: 'InBlock',
                      message: inBlockMessage ? inBlockMessage(result) : 'In Block',
                    },
                  });
              }

              if (response.status.isFinalized) {
                setStatus('Finalized');

                withNotifications &&
                  addNotification({
                    notification: {
                      type: 'Finalized',
                      message: finalizedMessage ? finalizedMessage(result) : 'Finalized',
                    },
                  });
              }
            })
            .catch((e) => {
              setStatus('None');
              const err = JSON.stringify(e);
              const message =
                err === '{}' ? (unknownErrorMessage ? unknownErrorMessage(e) : 'Something went wrong') : err;
              setError(message);
              console.error('tx error', message);

              withNotifications &&
                addNotification({
                  notification: {
                    type: 'Errored',
                    message,
                  },
                });
            });
        })
        .catch((e) => {
          setStatus('None');
          const err = JSON.stringify(e);

          const message = err === '{}' ? (unknownErrorMessage ? unknownErrorMessage(e) : 'Something went wrong') : err;
          setError(message);

          console.log('raw-error', e);
          console.error('pre-flight error:', message);

          withNotifications &&
            addNotification({
              notification: {
                type: 'Errored',
                message,
              },
            });
        });
    },
    [activeAccount, activeSigner, contract],
  );

  return {
    send,
    status,
    error,
    result,
    resetState: () => {
      setStatus('None');
      setError(null);
    },
  };
}
