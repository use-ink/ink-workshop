import { DependencyList, useEffect } from 'react';
import { useInk } from '../InkProvider';

export const useBlockSubscription = (fn: VoidFunction, deps?: DependencyList) => {
  const { header } = useInk();

  useEffect(() => {
    header && fn();
  }, [header?.number?.toHuman(), fn, deps]);
};
