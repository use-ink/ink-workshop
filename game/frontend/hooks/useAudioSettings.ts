import { useContext } from 'react';
import { AudioSettingsContext } from '../contexts/AudioSettingsContext';

export const useAudioSettings = () => useContext(AudioSettingsContext);
