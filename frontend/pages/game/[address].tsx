import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Layout } from '../../components/Layout';

const GamePage = dynamic(() => import('../../components/pg-game').then((mod) => mod.GamePage), {
  ssr: false,
});

const Game: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>ink! Splash</title>
        <meta name="description" content="Compete to win each pixel on the board by writing smart contracts in ink!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GamePage />
    </Layout>
  );
};

export default Game;
