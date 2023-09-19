import { ReactNode, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { BlockHeaderContext } from './context';
import { BlockHeader } from './model';

interface Props {
  children: ReactNode;
}

const toBlockNumber = (valWithComma: string | undefined): number => parseInt(`${valWithComma?.split(',').join('')}`);

export const BlockHeaderProvider: React.FC<Props> = ({ children }) => {
  const { api } = useApi();
  const [blockHeader, setBlockHeader] = useState<BlockHeader>({
    blockNumber: undefined,
    header: undefined,
  });

  useEffect(() => {
    async function listenToBlocks() {
      return api?.rpc.chain.subscribeNewHeads((header) => {
        try {
          const blockNumber = toBlockNumber(header.number.toHuman()?.toString());
          blockNumber && setBlockHeader({ blockNumber, header });
        } catch (e) {
          console.error(e);
        }
      });
    }
    let cleanUp: VoidFunction | undefined;
    listenToBlocks()
      .then((unsub) => (cleanUp = unsub))
      .catch(console.error);

    return () => cleanUp && cleanUp();
  }, [api]);

  return <BlockHeaderContext.Provider value={blockHeader}>{children}</BlockHeaderContext.Provider>;
};
