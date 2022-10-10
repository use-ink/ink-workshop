import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { GamePage } from '../../components/pg-game';
import { useUI } from '../../contexts/UIContext';

type Params = {
  address: string;
};

const Home: NextPage = () => {
  const { setGameAddress } = useUI();
  const { address } = useRouter().query;

  useEffect(() => {
    setGameAddress((address as string) || null);
  }, [address, setGameAddress]);

  return (
    <Layout>
      <Head>
        <title>Game | {address}</title>
        <meta name="description" content="Compete to win each pixel on the board by writing smart contracts in ink!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GamePage />
    </Layout>
  );
};

export default Home;
