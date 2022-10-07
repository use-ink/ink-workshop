import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import dynamic from 'next/dynamic';
import UIProvider from '../contexts/UIContext';

const InkProvider = dynamic(() => import('../lib/useInk/InkProvider'), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <InkProvider>
      <UIProvider>
        <Component {...pageProps} />
      </UIProvider>
    </InkProvider>
  );
}

export default MyApp;
