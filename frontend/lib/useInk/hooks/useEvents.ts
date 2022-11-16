import { useState } from 'react';
import { useInk } from '../InkProvider';

export const useEvents = (filter?: string) => {
  const [events, setEvents] = useState<any[]>([]);
  const { api } = useInk();

  api &&
    api.query.system.events((events: any[]) => {
      //   const filtered = events.filter((record) => {
      //     filter ? events : events;
      //   });
      events.forEach((record) => {
        // Extract the phase, event and the event types
        // const { event, phase } = record;
        // const types = event.typeDef;

        // // Show what we are busy with
        // console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
        // console.log(`\t\t${event.meta.toString()}`);

        // // Loop through each of the parameters, displaying the type and data
        // event.data.forEach((data: any, index: number) => {
        //   console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
        // });

        events.forEach(({ event, phase }) => {
          if (api.events.contracts.ContractEmitted.is(event)) {
            const [account_id, contract_evt] = event.data;
            console.log('event', contract_evt);
            // 0x016efb3107c0ab346e7e9d016e51bbb02b96324754b4688dd7fdf22b9b67e78dbd000500000008000000

            // if (account_id.toHuman() === '5Gx8mazdPiQkXJJV6KhvNkYNVZrM2WQqLoR1hLJpr26K6bBQ') {
            // }
            //   const decoded = METADATA.decodeEvent(contract_evt)
            //   console.log('decoded', decoded);
          }
        });
      });

      //   setEvents(filtered);
    });

  return events;
};
