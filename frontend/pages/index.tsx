import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useUI } from '../contexts/UIContext';
import { LanguageSelect } from './../components/pg-game/GameBoard/Settings/LanguageSelect';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'rules'])),
    },
  };
};

const Home: NextPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const { setShowRules } = useUI();
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>{t('pageTitle') || 'ink! Splash'}</title>
        <meta
          name="description"
          content={t('pageDescription') || 'Compete to win each pixel on the board by writing smart contracts in ink!'}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="h-screen w-full flex items-center justify-center p-6">
        <div className="bg-players-4 rounded-2xl px-8 py-10 text-center max-w-2xl w-full drop-shadow-xl z-20">
          <h6 className="text-xl font-semibold">{t('title')}</h6>
          <p className="text-sm mt-3">{t('description')}</p>
          <input
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-2xl bg-players-6 mt-6 mb-4 flex items-center justify-center text-center min-h-12 w-full py-4 px-6 focus:outline-none focus:ring-4 focus:ring-players-9"
            placeholder={t('gameAddressInput') || ''}
            value={address}
          />
          <h6 className="text-md font-semibold mt-6">{t('selectLanguage')}</h6>
          <LanguageSelect className="my-4" />
          <button
            className="font-fred w-full mt-4 rounded-2xl py-4 px-6 bg-players-8 hover:bg-players-8/80 drop-shadow-md transition duration-200 focus:outline-none focus:ring-4 focus:ring-players-9 text-lg"
            onClick={() => address && router.push(`/game/${address}`)}
          >
            {t('gameDescButton')}
          </button>
          <button
            className="text-white font-fred w-full mt-3 rounded-2xl py-4 px-6 bg-brand-500 hover:bg-brand-500/80 drop-shadow-md transition duration-200 focus:outline-none focus:ring-4 focus:ring-players-9 text-lg"
            onClick={() => setShowRules(true)}
          >
            {t('learnDescButton')}
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
