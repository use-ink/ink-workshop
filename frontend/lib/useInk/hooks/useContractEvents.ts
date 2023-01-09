import { Abi } from '@polkadot/api-contract';
import { Bytes } from '@polkadot/types';
import { useContext, useEffect } from 'react';
import { HALF_A_SECOND } from '../constants';
import { ContractEventsContext } from '../providers/contractEvents/context';
import { ContractEvent } from '../providers/contractEvents/model';
import { LogsContext } from '../providers/logs/context';
import { getExpiredItem } from '../utils/getExpiredItem';
import { useApi } from './useApi';
import { useBlockHeader } from './useBlockHeader';
import { useConfig } from './useConfig';
import { useInterval } from './useInterval';

export const useContractEvents = (address: string, abi: Abi, withLogs?: boolean): ContractEvent[] => {
  const { events, addContractEvent, removeContractEvent } = useContext(ContractEventsContext);
  const { addLog } = useContext(LogsContext);
  const { api } = useApi();
  const { blockNumber, header } = useBlockHeader();
  const config = useConfig();

  const eventsForAddress = events[address] || [];

  useEffect(() => {
    address &&
      abi &&
      api &&
      header?.hash &&
      api.at(header?.hash).then((apiAt) => {
        apiAt.query.system.events((encodedEvent: any[]) => {
          encodedEvent.forEach(({ event }) => {
            if (api.events.contracts.ContractEmitted.is(event)) {
              const [contractAddress, contractEvent] = event.data;
              if (address && contractAddress.toString().toLowerCase() === address.toLowerCase()) {
                try {
                  const decodedEvent = abi.decodeEvent(contractEvent as Bytes);

                  const eventItem = {
                    address,
                    event: {
                      name: decodedEvent.event.identifier,
                      args: decodedEvent.args.map((v) => v.toHuman()),
                    },
                  };

                  addContractEvent(eventItem);
                  if (withLogs) addLog(JSON.stringify(eventItem));
                } catch (e) {
                  console.error(e);
                }
              }
            }
          });
        });
      });
  }, [abi, addContractEvent, addLog, address, api, blockNumber, header?.hash, withLogs]);

  useInterval(() => {
    const expiredEvents = getExpiredItem<ContractEvent>(eventsForAddress, config.notifications?.expiration);
    for (const contractEvent of expiredEvents) {
      removeContractEvent({ eventId: contractEvent.id, address });
    }
  }, config.notifications?.checkInterval || HALF_A_SECOND);

  return eventsForAddress;
};
