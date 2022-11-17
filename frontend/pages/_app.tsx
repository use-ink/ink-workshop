import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import dynamic from 'next/dynamic';
import UIProvider from '../contexts/UIContext';
import { AudioSettingsProvider } from '../contexts/AudioSettingsContext';

const InkProvider = dynamic(() => import('../lib/useInk/InkProvider'), {
  ssr: false,
});

const GameProvider = dynamic(() => import('../contexts/GameContext').then(({ GameProvider }) => GameProvider), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <InkProvider>
      <UIProvider>
        <AudioSettingsProvider>
          <GameProvider>
            <Component {...pageProps} />
          </GameProvider>
        </AudioSettingsProvider>
      </UIProvider>
    </InkProvider>
  );
}

export default MyApp;
