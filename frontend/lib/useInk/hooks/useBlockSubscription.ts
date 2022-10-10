import { useEffect } from 'react';
import { useInk } from '../InkProvider';

export const useBlockSubscription = (fn: VoidFunction) => {
  const { header } = useInk();

  useEffect(() => {
    header && fn();
  }, [header?.number?.toHuman(), fn.toString]);
};
