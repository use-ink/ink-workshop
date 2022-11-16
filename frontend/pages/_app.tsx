import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import dynamic from 'next/dynamic';
import UIProvider from '../contexts/UIContext';

const InkProvider = dynamic(() => import('../lib/useInk/InkProvider'), {
  ssr: false,
});

const GameProvider = dynamic(() => import('../contexts/GameContext').then(({ GameProvider }) => GameProvider), {
  ssr: false,
});

const AudioSettingsProvider = dynamic(
  () => import('../contexts/AudioSettingsContext').then(({ AudioSettingsProvider }) => AudioSettingsProvider),
  {
    ssr: false,
  },
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <InkProvider>
      <UIProvider>
        <GameProvider>
          <AudioSettingsProvider>
            <Component {...pageProps} />
          </AudioSettingsProvider>
        </GameProvider>
      </UIProvider>
    </InkProvider>
  );
}

export default MyApp;
