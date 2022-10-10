import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState('');

  return (
    <Layout>
      <Head>
        <title>Squink Splash! - A coding game using ink!</title>
        <meta name="description" content="Compete to win each pixel on the board by writing smart contracts in ink!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="h-screen w-full flex items-center justify-center p-6">
        <div className="bg-players-4 rounded-2xl px-8 pt-12 pb-10 text-center max-w-2xl w-full drop-shadow-xl">
          <h6 className="text-xl font-semibold">Welcome to Squink Splash!</h6>
          <p className="text-sm mt-3">Enter a game contract address to get started.</p>
          <input
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-2xl bg-players-6 mt-12 flex items-center justify-center text-center min-h-12 w-full py-4 px-6 focus:outline-none focus:ring-4 focus:ring-players-9"
            placeholder="Game address..."
            value={address}
          />
          <button
            className="w-full mt-6 rounded-2xl py-4 px-6 bg-players-8 hover:bg-players-8/80 drop-shadow-md transition duration-200 focus:outline-none focus:ring-4 focus:ring-players-9"
            onClick={() => address && router.push(`/game/${address}`)}
          >
            <h6>Let&apos;s Play!</h6>
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
