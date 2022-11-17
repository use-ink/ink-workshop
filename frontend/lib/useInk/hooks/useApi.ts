import { useContext } from 'react';
import { APIContext } from '../providers/api/context';

export type { API } from '../providers/api/model';

export const useApi = () => useContext(APIContext);
