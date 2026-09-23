'use client';
import React from 'react';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import StoreCards from '../../components/Carousel';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { NextPage } from 'next';

const Home: NextPage = () => {
  const settings = useSiteSettings();
  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">{settings.contactTitle}</h1>
          <p className="text-xl md:text-2xl text-zinc-600">{settings.contactDescription}</p>
        </div>
        <StoreCards />
      </main>
    </Layout>
  );
}

export default Home;
