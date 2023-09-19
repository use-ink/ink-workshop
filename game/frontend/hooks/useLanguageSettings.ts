import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useLanguageSettings = () => useContext(LanguageContext);
