import { ReactNode, useCallback, useReducer } from 'react';
import { ContractEventsContext } from './context';
import { AddContractEventPayload, DEFAULT_CONTRACT_EVENTS, RemoveContractEventPayload } from './model';
import { useIsMounted } from '../../hooks/useIsMounted';
import { nanoid } from 'nanoid';
import { contractEventReducer } from './reducer';

interface Props {
  children: ReactNode;
}

// @internal
export const ContractEventsProvider = ({ children }: Props) => {
  const [events, dispatch] = useReducer(contractEventReducer, DEFAULT_CONTRACT_EVENTS);
  const isMounted = useIsMounted();

  const addContractEvent = useCallback(
    ({ event, address }: AddContractEventPayload) => {
      if (isMounted()) {
        dispatch({
          type: 'ADD_CONTRACT_EVENT',
          address,
          event: { ...event, id: nanoid(), createdAt: Date.now() },
        });
      }
    },
    [isMounted],
  );

  const removeContractEvent = useCallback(
    ({ eventId, address }: RemoveContractEventPayload) => {
      if (isMounted()) {
        dispatch({
          type: 'REMOVE_CONTRACT_EVENT',
          address,
          eventId,
        });
      }
    },
    [isMounted],
  );

  return (
    <ContractEventsContext.Provider value={{ addContractEvent, events, removeContractEvent }}>
      {children}
    </ContractEventsContext.Provider>
  );
};
