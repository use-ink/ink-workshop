import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const GamePage = dynamic(() => import('../../components/pg-game').then((mod) => mod.GamePage), {
  ssr: false,
});

const Game: NextPage = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          name="description"
          content={t('pageDescription') || 'Compete to win each pixel on the board by writing smart contracts in ink!'}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GamePage />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'events'])),
  },
});

export default Game;
